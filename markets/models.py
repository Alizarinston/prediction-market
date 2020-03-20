from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from config import constants
from . import exceptions
from .helpers import cost_function, probabilities


CATEGORIES = ('FIN', 'Finances'), ('POL', 'Politics'), ('SPO', 'Sports'), ('OTH', 'Other')


class MarketUser(AbstractUser):
    """ Prediction market custom user model """

    # :field wallet: dict, user`s outcomes wallet in format:
    #   {outcome.pk: amount,}

    cash = models.FloatField(default=10)
    wallet = JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'users'


class TimeStamped(models.Model):
    """ An abstract base class model that provides self updating """

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Outcome(models.Model):
    """ The model of a variant of a market prediction """

    amount = models.PositiveIntegerField(default=0)
    probability = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)])

    description = models.CharField(
        max_length=constants.outcome_description_max_length,
        validators=[MinLengthValidator(constants.outcome_description_min_length)]
    )

    class Meta:
        db_table = 'outcomes'

    def __str__(self):
        return self.description

    def is_winner(self) -> bool:
        if self.market.first().resolved:
            return self.probability == 100

        return False


class Market(TimeStamped):
    """ A model that represents a prediction of an event occurring in future """

    name = models.CharField(
        max_length=constants.market_name_max_length,
        validators=[MinLengthValidator(constants.market_name_min_length)]
    )

    start_date = models.DateField()
    end_date = models.DateField()
    supply = models.FloatField(default=0)
    anon = models.BooleanField(default=False)
    proposal = models.BooleanField(default=True)
    resolved = models.BooleanField(default=False)
    outcomes = models.ManyToManyField(Outcome, related_name='market')

    category = models.CharField(
        choices=CATEGORIES,
        default=CATEGORIES[3][0],
        max_length=constants.category_length,
        validators=[MinLengthValidator(constants.category_length)]
    )

    description = models.CharField(
        max_length=constants.market_description_max_length,
        validators=[MinLengthValidator(constants.market_description_min_length)]
    )

    class Meta:
        db_table = 'markets'

    def __str__(self):
        return '{}, resolved: {}'.format(self.name, self.resolved)

    def resolve(self, winner: Outcome) -> None:
        """ Resolve market by setting outcomes probabilities """

        winner.probability = 100
        winner.save(update_fields=['probability'])

        for outcome in self.outcomes.exclude(pk=winner.pk):
            outcome.probability = 0
            outcome.save(update_fields=['probability'])

        self.resolved = True
        self.save(update_fields=['resolved'])

    def get_cost(self, outcome: Outcome, amount_delta: float) -> float:
        """ Get outcome cost """

        old_amounts = [outcome.amount for outcome in self.outcomes.all()]

        outcome.amount += amount_delta
        outcome.save(update_fields=['amount'])

        outcomes = self.outcomes.all()
        new_amounts = [outcome.amount for outcome in outcomes]
        outcome_probabilities = probabilities(new_amounts)

        for i in range(len(outcomes)):
            outcomes[i].probability = outcome_probabilities[i]
            outcomes[i].save(update_fields=['probability'])

        return cost_function(new_amounts) - cost_function(old_amounts)


class Order(TimeStamped):
    """ Instruction to buy or sell shares at the current price """

    # :field: order_type: bool, False - buy, True - sell

    order_type = models.BooleanField()
    amount = models.PositiveIntegerField(default=0)
    outcome = models.ForeignKey(Outcome, related_name='order', on_delete=models.PROTECT)
    user = models.ForeignKey(MarketUser, related_name='orders', on_delete=models.PROTECT)
    price = models.FloatField(default=0)

    def __str__(self):
        return 'Type: {}, amount: {}'.format(self.order_type, self.amount)

    def populate(self) -> None:
        """ Populate Order model before saving """

        if not self.order_type:
            self._buy()
        else:
            self._sell()

    def _buy(self) -> None:
        """ Order buy case """

        cost = self.outcome.market.first().get_cost(self.outcome, self.amount)

        if self.user.cash >= cost:
            self.user.cash -= cost
            outcome_pk = str(self.outcome.pk)

            if outcome_pk in self.user.wallet:
                self.user.wallet[outcome_pk] += self.amount
                self.price = cost

            else:
                self.user.wallet[outcome_pk] = self.amount
                self.price = cost

            self.user.save(update_fields=['cash', 'wallet'])

        else:
            raise exceptions.NotEnoughCash

    def _sell(self) -> None:
        """ Order sell case """

        outcome_pk = str(self.outcome.pk)

        if outcome_pk in self.user.wallet and self.user.wallet[outcome_pk] >= self.amount:
            cost = self.outcome.market.first().get_cost(self.outcome, -self.amount)
            self.user.cash += -cost
            self.price = -cost
            self.user.wallet[outcome_pk] -= self.amount
            self.user.save(update_fields=['cash', 'wallet'])

        else:
            raise exceptions.NotEnoughOutcomeAmount

    @staticmethod
    def calculate_asset(outcome: Outcome) -> int:
        return sum(Order.objects.filter(outcome=outcome).values_list('amount', flat=True))
