from math import log, e
from config.constants import b_constant


def cost_function(amounts: list, b: float = b_constant) -> float:
    """ Compute transaction cost """

    return b * log(sum([e ** (amount / b) for amount in amounts]))


def probabilities(amounts: list, b: float = b_constant) -> list:
    """ Compute probabilities for every amount """

    amount_sum = sum([e ** (amount / b) for amount in amounts])
    return [(e ** (amount / b)) / amount_sum for amount in amounts]
