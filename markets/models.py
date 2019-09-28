from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from config import constants
from users.models import MarketUser
from . import exceptions
from .helpers import cost_function, probabilities


class TimeStamped(models.Model):
    """ An abstract base class model that provides self updating """

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class Outcome(models.Model):
    """ The model of a variant of a market prediction """

    outstanding = models.PositiveSmallIntegerField(default=0)
    probability = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])

    description = models.CharField(
        max_length=constants.outcome_description_max_length,
        validators=[MinLengthValidator(constants.outcome_description_min_length)]
    )

    class Meta:
        db_table = 'outcomes'

    def __str__(self):
        return self.description

    def is_winner(self) -> bool:
        return self.probability == 100


class Market(TimeStamped):
    """ A model that represents a prediction of an event occurring in future """

    name = models.CharField(
        max_length=constants.market_name_max_length,
        validators=[MinLengthValidator(constants.market_name_min_length)]
    )

    start_date = models.DateField()
    end_date = models.DateField()
    resolved = models.BooleanField(default=False)
    outcomes = models.ManyToManyField(Outcome, related_name='market')
    description = models.CharField(
        max_length=constants.market_description_max_length,
        validators=[MinLengthValidator(constants.market_description_min_length)]
    )

    class Meta:
        db_table = 'markets'

    def __str__(self):
        return '{}, resolved: {}'.format(self.name[:constants.market_name_preview_length] + '...', self.resolved)

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

        old_amounts = [outcome.outstanding for outcome in self.outcomes.all()]

        outcome.outstanding += amount_delta
        outcome.save(update_fields=['outstanding'])

        outcomes = self.outcomes.all()
        new_amounts = [outcome.outstanding for outcome in outcomes]
        outcome_probabilities = probabilities(constants.b_constant, new_amounts)

        for i in range(len(outcomes)):
            outcomes[i].probability = outcome_probabilities[i]
            outcomes[i].save(update_fields=['probability'])

        return cost_function(constants.b_constant, new_amounts) - cost_function(constants.b_constant, old_amounts)


class Proposal(TimeStamped):
    """ A model that represents a proposal for a future market """

    name = models.CharField(
        max_length=constants.market_name_max_length,
        validators=[MinLengthValidator(constants.market_name_min_length)]
    )
    supply = models.FloatField(default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    outcomes = models.ManyToManyField(Outcome, related_name='proposal')
    description = models.CharField(
        max_length=constants.market_description_max_length,
        validators=[MinLengthValidator(constants.market_description_min_length)]
    )
    anon = models.BooleanField(default=False)

    class Meta:
        db_table = 'proposal'

    def __str__(self):
        return '{}, supply: {}'.format(self.name[:constants.market_name_preview_length] + '...', self.supply)


class Asset(models.Model):
    """ User`s asset model. The total number of purchased outcome of a particular user """

    amount = models.PositiveSmallIntegerField(default=0)
    closed = models.BooleanField(default=False)
    outcome = models.OneToOneField(Outcome, on_delete=models.CASCADE)

    class Meta:
        db_table = 'assets'

    def __str__(self):
        return '{}: {}'.format(self.outcome.description, self.amount)


class Order(TimeStamped):
    """ Instruction to buy or sell shares at the current price """

    # :field: order_type: bool, 0 - buy, 1 - sell

    order_type = models.BooleanField()
    amount = models.PositiveSmallIntegerField(default=0)
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return 'Type: {}, amount: {}'.format(self.order_type, self.amount)

    def populate(self, outcome: Outcome, user: MarketUser) -> None:
        """ Populate Order model before saving """

        if not self.order_type:
            self._buy(outcome, user)
        else:
            self._sell(outcome, user)

    def _buy(self, outcome: Outcome, user: MarketUser) -> None:
        """ Order buy case """

        if self.asset is None:
            self.asset = Asset.objects.create(outcome=outcome)

        else:
            try:
                self.asset = Asset.objects.get(outcome=outcome)

            except Asset.DoesNotExist:
                msg = 'Asset with specified outcome not found. Description: {}'.format(outcome.description)
                raise exceptions.AssetDoesNotExist(msg)

        cost = self.asset.outcome.market.first().get_cost(outcome, self.amount)

        if user.cash - cost >= 0:
            user.cash -= cost
            user.save(update_fields=['cash'])
            self.asset.amount += self.amount
            self.asset.save(update_fields=['amount'])

        else:
            raise exceptions.NotEnoughCash

    def _sell(self, outcome: Outcome, user: MarketUser) -> None:
        """ Order sell case """

        try:
            self.asset = Asset.objects.get(outcome=outcome)

        except Asset.DoesNotExist:
            msg = 'Asset with specified outcome not found. Description: {}'.format(outcome.description)
            raise exceptions.AssetDoesNotExist(msg)

        cost = self.asset.outcome.market.first().get_cost(outcome, self.amount)

        if self.asset.amount >= self.amount:
            user.cash += cost
            user.save(update_fields=['cash'])
            self.asset.amount += self.amount
            self.asset.save(update_fields=['amount'])

        else:
            raise exceptions.NotEnoughAssetAmount
