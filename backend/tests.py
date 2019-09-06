from django.test import TestCase
from backend.models import Market, Outcome
import datetime


class CreateMarketTestCase(TestCase):
    def setUp(self):
        Market.objects.create(name='market',
                              b=100,
                              start_date=datetime.date(2019, 3, 1),
                              end_date=datetime.date(2019, 3, 4))

    def test_correct_outcomes_are_created(self):
        market = Market.objects.get(name='market')
        outcomes = market.outcomes.all()
        base = market.start_date
        n_days = (market.end_date - market.start_date).days
        dates = [base + datetime.timedelta(days=x) for x in range(0, n_days)]
        self.assertEqual(market.number_of_outcomes, len(outcomes))
        self.assertEqual(market.resolved, False)
        for date, outcome in zip(dates, outcomes):
            self.assertEqual(outcome.outcome_date, date)
            self.assertEqual(outcome.winning, False)
            self.assertEqual(outcome.outstanding, 0)
            self.assertEqual(outcome.probability, 1 / len(outcomes))
