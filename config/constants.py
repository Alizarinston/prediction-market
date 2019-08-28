from unipath import Path

# file paths
base_dir = Path(__file__).absolute().ancestor(2)
secret_filename = base_dir.child('config').child('secret.json')
