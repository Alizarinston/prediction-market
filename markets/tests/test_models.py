from django.test import TestCase
from ..models import MarketUser


class MarketUserTest(TestCase):
    """ Test custom user model creation and deleting """

    def setUp(self) -> None:
        self.username = 'test_user'

    def test_creation(self):
        MarketUser.objects.create_superuser(self.username, 'test_email@mail.com', '1234')
        user = MarketUser.objects.get_by_natural_key(self.username)
        self.assertTrue(isinstance(user, MarketUser))

    def test_deleting(self):
        user = MarketUser.objects.create_superuser(self.username, 'test_email@mail.com', '1234')
        user.delete()
        self.assertRaises(MarketUser.DoesNotExist, MarketUser.objects.get_by_natural_key, self.username)
