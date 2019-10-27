from django.utils.translation import ugettext_lazy as _

from math import log, e
from config.constants import b_constant

from .exceptions import MarketBaseError


def cost_function(amounts: list, b: float = b_constant) -> float:
    """ Compute transaction cost """

    try:
        return b * log(sum([e ** (amount / b) for amount in amounts]))

    except OverflowError:
        raise MarketBaseError(_('Transaction error.'))


def probabilities(amounts: list, b: float = b_constant) -> list:
    """ Compute probabilities for every amount """

    try:
        amount_sum = sum([e ** (amount / b) for amount in amounts])
        return [(e ** (amount / b)) / amount_sum for amount in amounts]

    except OverflowError:
        raise MarketBaseError(_('Transaction error.'))
