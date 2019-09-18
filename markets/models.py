from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from config import constants
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
    outcomes = models.ForeignKey(Outcome, related_name='results', on_delete=models.CASCADE)

    class Meta:
        db_table = 'markets'

    def __str__(self):
        return '{}, resolved: {}'.format(self.name[:constants.market_name_preview_length] + '...', str(self.resolved))

    def resolve(self) -> None:
        """ Resolve market by setting outcomes probabilities """

        for outcome in self.outcomes.results.all():
            if outcome.winning:
                outcome.probability = 1
            else:
                outcome.probability = 0

            outcome.save(update_fields=['probability'])

        self.resolved = True
        self.save(update_fields=['resolved'])

    def get_cost(self, amount_delta: float) -> None:
        """ Get outcome cost """

        pass

        '''
        outcomes = self.outcomes.results.all()
        old_amounts = [outcome.outstanding for outcome in outcomes]

        for outcome in enumerate(outcomes):
            if o.pk == self.pk:
                new_outcomes[i].outstanding += amount_delta

        new_amounts = [o.outstanding for o in new_outcomes]
        cost = cost_function(self.market.b, new_amounts) - cost_function(self.market.b, old_amounts)
        probs = probabilities(self.market.b, new_amounts)

        for i, o in enumerate(new_outcomes):
            new_outcomes[i].probability = probs[i]

        return cost, new_outcomes
        '''


class Asset(models.Model):
    """ User`s asset model. The total number of purchased outcome of a particular user """

    amount = models.PositiveSmallIntegerField(default=0)
    closed = models.BooleanField(default=False)
    outcome = models.OneToOneField(Outcome, on_delete=models.CASCADE)

    class Meta:
        db_table = 'assets'

    def __str__(self):
        return '{}: {}'.format(self.outcome.description, str(self.amount))


class Order(TimeStamped):
    """ Instruction to buy or sell shares at the current price """

    pass

    '''
    amount = models.PositiveSmallIntegerField(default=0)
    order_type = models.BooleanField()
    asset = models.OneToOneField(Asset, on_delete=models.CASCADE, blank=True)

    def save(self, *args, **kwargs):
        self.market = self.outcome.market
        if self.type == 'buy':
            self._buy_save()
            super(Order, self).save(*args, **kwargs)
        elif self.type == 'sell':
            self._sell_save()
            super(Order, self).save(*args, **kwargs)

    def _buy_save(self):
        outcomes = Outcome.objects.filter(market=self.outcome.market)
        try:
            position = Asset.objects.get(outcome=self.outcome.id, portfolio=self.portfolio.id)
            self.position = position
        except Outcome.DoesNotExist:
            position = Asset(
                outcome=self.outcome,
                market=self.outcome.market,
                portfolio=self.portfolio,
                amount=0,
                closed=False,
            )
            self.position = position
            self.position.save()
        finally:
            self.position = position
        delta = self.amount
        cost, new_outcomes = self.outcome.get_cost(delta)
        if self.portfolio.cash - cost >= 0:
            self.portfolio.cash -= cost
            self.portfolio.save()
            self.position.amount += self.amount
            self.position.save()
            for o in new_outcomes:
                o.save()
        else:
            raise NotEnoughFunds

    def _sell_save(self):
        outcomes = Outcome.objects.filter(market=self.outcome.market)
        try:
            position = Asset.objects.get(outcome=self.outcome.id, portfolio=self.portfolio.id)
        except Outcome.DoesNotExist:
            raise PositionDoesNotExist
        self.position = position
        delta = -self.amount
        cost, new_outcomes = self.outcome.get_cost(delta)
        if position.amount >= self.amount:
            self.portfolio.cash -= cost
            self.portfolio.save()
            self.position.amount -= self.amount
            self.position.save()
            for o in new_outcomes:
                o.save()
        else:
            raise NotEnoughPositionAmount
    '''
