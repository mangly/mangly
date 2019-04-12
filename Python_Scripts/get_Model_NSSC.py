import sys, json
import numpy as np
from model import NSSC, Pnisland
from functions import readScenario

def get_NSSC_vectors(type, scenario, start = 0, end = 500, n = 500):
    model = 'initializing'

    if(type == "General"):
        model = NSSC(scenario)

    elif(type == 'Symmetrical'):
        model = Pnisland(scenario)

    x_vector = [0.1*(np.exp(i * np.log(1+10*end)/n)-1) for i in range(n+1)]
    IICR_specie = list(model.evaluateIICR(x_vector))
    # IICR_specie = [model.evaluateIICR(i) for i in x_vector]

    return {'x_vector': x_vector, 'IICR_specie': IICR_specie}

model_type = sys.argv[2]
scenario = json.loads(sys.argv[1])

print(json.dumps(get_NSSC_vectors(model_type, scenario)))


