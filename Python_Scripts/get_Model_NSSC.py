import sys, json
from functions import readScenario, get_NSSC_vectors

model_type = sys.argv[2]
scenario = json.loads(sys.argv[1])

print(json.dumps(get_NSSC_vectors(model_type, scenario)))


