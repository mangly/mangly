import numpy as np
import json
from functions import readScenario
from model import NSSC

human_scenario_file = "./scenarios/demo_scenario_humans.txt"

def get_NSSC_vectors(scenario, start = 0, end = 500, n = 500):

    d_humans = readScenario(human_scenario_file)
    model_humans = NSSC(d_humans)
    # start = 0
    # end = 100
    # n = 500
    x_vector = [0.1*(np.exp(i * np.log(1+10*end)/n)-1) for i in range(n+1)]
    IICR_specie = [model_humans.evaluateIICR(i) for i in x_vector]
    return {'name': '', 'x_vector': x_vector, 'IICR_specie': IICR_specie}

   
print(json.dumps(get_NSSC_vectors(human_scenario_file)))
#print(readScenario(human_scenario_file))


