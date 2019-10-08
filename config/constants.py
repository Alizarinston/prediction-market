from unipath import Path

# file paths
base_dir = Path(__file__).absolute().ancestor(2)
secret_filename = base_dir.child('config').child('secret.json')

# utils
owm_timeout = 60

# market models
b_constant = 100
market_name_max_length = 150
market_name_min_length = 10
market_description_min_length = 10
market_description_max_length = 100
outcome_description_min_length = 5
outcome_description_max_length = 100
category_length = 3
