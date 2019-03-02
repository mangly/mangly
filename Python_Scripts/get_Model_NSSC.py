import sys, json
import numpy as np
from functions import readScenario
from model import NSSC, Pnisland

# human_scenario_file = "./scenarios/HumansNeandScenario_samplingHumansTest.txt"

def get_NSSC_vectors(type, scenario, start = 0, end = 500, n = 500):
    model = 'initializing'

    if(type == "General"):
        model = NSSC(json.loads(scenario))

    elif(type == 'Symmetrical'):
        model = Pnisland(json.loads(scenario))

    x_vector = [0.1*(np.exp(i * np.log(1+10*end)/n)-1) for i in range(n+1)]
    # IICR_specie = [model.evaluateIICR(i) for i in x_vector]

    IICR_specie = []

    for i in range(0, len(x_vector)):
        y = model.evaluateIICR(x_vector[i])

        if np.isinf(y):
            y = IICR_specie[i-1]
            
        IICR_specie.append(y)

    return {'x_vector': x_vector, 'IICR_specie': IICR_specie}

print(json.dumps(get_NSSC_vectors(sys.argv[2], sys.argv[1])))


