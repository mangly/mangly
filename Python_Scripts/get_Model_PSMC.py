import sys, json
from functions import get_PSMC_results

path = sys.argv[1]
name = sys.argv[2]

print(json.dumps(get_PSMC_results(path, name)))



