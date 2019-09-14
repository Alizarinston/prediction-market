import math
from django.db import models, transaction
from django.core.exceptions import ObjectDoesNotExist


class Market(models.Model):
    """
    Передбачення щодо настання тієї чи іншої події

    b - константа, яку ми самі визначаємо для регулювання впливу транзакції користувача (сильно це повпливає на ціни
    акцій чи не дуже), що залежить від кількості учасників цього передбачення

    start_date - з цього моменту можлива торгівля акціями/"исходами" (outcomes)

    end_date - з цього моменту торгувати неможливо (не факт, може й можна, нада тестувать), подія вже відбулася (і
    всі юзери мають знати що цей маркет уже просрочений і чекає свого рішення), адміни мають позначити яка саме

    resolved - адміни снізошли і рішили цю загадку, як тіки позначається True, правильний outcome коштує максимальну
    ціну, типу 100 токенів за акцію (ну всмислі 100%, бо така ймовірність його настання), а всі інші 0

    outcomes_description - список можливих варіантів настання події перечислених через якийсь роздільний знак,
    по ідеї формується з полей фронтенд сторінки. Спочатку всі події рівноцінні (1 / кількість варіантів),
    це і формує їх початкову ціну (тобто ймовірність у відсотках)

    """
    name = models.CharField(max_length=256)
    b = models.FloatField()
    number_of_outcomes = models.IntegerField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    resolved = models.BooleanField(default=False)
    outcomes_description = models.TextField()

    @transaction.atomic
    def save(self, *args, **kwargs):
        Outcome.objects.all()
        outcomes_list = list(str(self.outcomes_description).split(';'))
        self.number_of_outcomes = len(outcomes_list)
        super(Market, self).save(*args, **kwargs)
        if self.resolved:
            o = Outcome.objects.all().filter(market=self.pk)
            for i in o:
                if i.winning:
                        i.probability = 100
                else:
                    i.probability = 0
                i.save()
        else:
            P = 1 / self.number_of_outcomes
            for description in outcomes_list:
                outcome = Outcome(
                    market=self,
                    description=str(description),
                    outstanding=0,
                    probability=P)
                outcome.save()

    def __str__(self):
        return self.name


class Outcome(models.Model):
    """
    Можливий варіант настання події якогось передбачення (або просто акція)

    market - передбачення, одним із "исходов" якого є оцей outcome

    description - опис цього оуткама, можна брать з outcomes_description в моделі Market

    outstanding - кількість акцій цього екземпляра що знаходяться в обігу (їх хтось купив і ще не продав)

    probability - ймовірність настання цієї події (якщо брати у відсотках) і також його ціна

    winning - яйщо True (що може бути тільки якщо маркет resolved), значить його ціна 100, всі інші 0

    """
    market = models.ForeignKey(Market, related_name='outcomes', on_delete=models.CASCADE)
    description = models.CharField(max_length=256)
    outstanding = models.IntegerField()
    probability = models.FloatField()
    winning = models.BooleanField(default=False)

    def get_cost(self, amount_delta):
        old_outcomes = Outcome.objects.all().filter(market=self.market.pk)
        new_outcomes = Outcome.objects.all().filter(market=self.market.pk)
        old_amounts = (o.outstanding for o in old_outcomes)
        for i, o in enumerate(new_outcomes):
            if o.pk == self.pk:
                new_outcomes[i].outstanding += amount_delta
        new_amounts = [o.outstanding for o in new_outcomes]
        cost = cost_function(self.market.b, new_amounts) - cost_function(self.market.b, old_amounts)
        probs = probabilities(self.market.b, new_amounts)
        for i, o in enumerate(new_outcomes):
            new_outcomes[i].probability = probs[i]
        return cost, new_outcomes

    def __str__(self):
        return self.description


class Position(models.Model):
    """
    Загальна кількість куплених акцій конкретного outcome користувача (персональна інформація, типу список активів),
    аналог Portfolio, тільки для куплених акцій, які постійно змінюються в ціні, поки Market не закриється,
    так шо рано чи пізно їх доведеться продати (або купити, це у випадку шорта, ну щас це не нада, забєй)

    market - передбачення, до якого прив'язані акції цього outcome

    amount - кількість куплених акцій конкретного outcome

    closed - обнулити кількість активів на конеретний outcome, то ість продать всі акції по поточній ціні (або
    купить і отдать, то інша історія)

    """
    outcome = models.ForeignKey(Outcome, on_delete=models.CASCADE)
    market = models.ForeignKey(Market, on_delete=models.CASCADE)
    # portfolio = models.ForeignKey(Portfolio, related_name='positions', on_delete=models.CASCADE, blank=True)
    amount = models.IntegerField(default=0)
    closed = models.BooleanField(default=False)


class Order(models.Model):
    """
    Ордер (інструкція) на покупку або продаж акцій по поточній ціні. В нашому випадку є маркетмейкер, то ість ціна
    динамічна і покупка відбудеться автоматично, то ість її не встигнеш відмінити, але в теорії можна (потім
    подумаємо про реалізацію без маркетмейкера, то ість покупка і продаж відбувається з іншими користувачами)

    position - якщо в тебе немає цих outcomes, створюється автоматично, якщо в тебе вже є непродані акції цього
    outcome, то оновлюється існуючий

    """
    outcome = models.ForeignKey(Outcome, on_delete=models.CASCADE)
    market = models.ForeignKey(Market, related_name='orders', on_delete=models.CASCADE)
    # portfolio = models.ForeignKey(Portfolio, related_name='orders', on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE, blank=True)
    type = models.TextField(choices=[('buy', 'Buy'), ('sell', 'Sell')])
    amount = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    @transaction.atomic
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
            position = Position.objects.get(outcome=self.outcome.id, portfolio=self.portfolio.id)
            self.position = position
        except ObjectDoesNotExist:
            position = Position(
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
            position = Position.objects.get(outcome=self.outcome.id, portfolio=self.portfolio.id)
        except ObjectDoesNotExist:
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


def cost_function(b, amounts):
    """
    обчислюється ціна транзакції
    """
    return b * math.log(sum((math.e ** (a / b) for a in amounts)))


def probabilities(b, amounts):
    """
    обчислюється ціна актива
    """
    s = sum((math.e ** (a / b) for a in amounts))
    return [(math.e ** (a / b)) / s for a in amounts]


class NotEnoughFunds(Exception):
    pass


class PositionDoesNotExist(Exception):
    pass


class NotEnoughPositionAmount(Exception):
    pass
