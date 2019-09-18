from math import log, e


def cost_function(b: float, amounts: list) -> float:
    """ Compute transaction cost """

    return b * log(sum([e ** (amount / b) for amount in amounts]))


def probabilities(b: float, amounts: list) -> list:
    """ Compute probabilities (assets prices) for every amount """

    amount_sum = sum([e ** (amount / b) for amount in amounts])
    return [(e ** (amount / b)) / amount_sum for amount in amounts]
