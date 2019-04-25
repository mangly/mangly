import sys, json
from get_File_Results import get_PSMC_results

path = sys.argv[1]
name = sys.argv[2]

print(json.dumps(get_PSMC_results(path, name)))



