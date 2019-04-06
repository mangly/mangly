import sys, json
from scipy.optimize import differential_evolution
# import numpy as np
from model import NSSC, Pnisland
# from get_File_Results import get_PSMC_results
# import random
from metaheuristhics_utilities import get_scenario
from metaheuristhics_utilities import multi_dim_conversion
from metaheuristhics_utilities import valid_state
from metaheuristhics_utilities import get_optimal_scenario
from functions import get_NSSC_vectors

# psmc = get_PSMC_results('./experiment_1.psmc')

# mu = 1.25e-8
# s = 100
# Nref = psmc['theta']/(4*mu*s)

# x_vector = [2*Nref*i for i in psmc['time']]
# y_vector = [Nref*i for i in psmc['IICR_2']]

# new_scenario = {'samplingVector': [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'scenario':[{'time': 0, 'n':15, 'M':1, 'c':1}, {'time':10, 'n':15, 'M':50, 'c':1}, {'time':50, 'n':15, 'M':1, 'c':1}]}

# def compute_Distance(vectors, scenario_NSSC, n_ref):
#     vectors = json.loads(vectors)
#     scenario_NSSC = json.loads(scenario_NSSC)

#     model_NSSC = Pnisland(scenario_NSSC)

#     return model_NSSC.compute_distance(vectors['x'], vectors['y'], int(n_ref))

vectors = json.loads(sys.argv[1])
scenario_NSSC = json.loads(sys.argv[2])

# variables_count = (len(scenario_NSSC['scenario']) * 3) + 2
# init_state = get_initial_state(new_scenario, 500)

def compute_distance(state):
    multi_state = multi_dim_conversion(state, 3)

    if(valid_state(multi_state)):  
        nssc_model = Pnisland(get_scenario(scenario_NSSC, state))
        d = nssc_model.compute_distance(vectors['x'], vectors['y'], state[len(state) - 1])
        return d

    return 10000000000000000000

bounds = [(0, 0), (1, 50), (1,5), (1, 50), (1, 50), (1,5), (2, 50), (1, 50), (1,5), (2,20), (1, 1000)]
result = differential_evolution(compute_distance, bounds, maxiter = 1000, popsize = 15, mutation = (0.5,1), recombination = 0.7)

n_ref = round(result.x[len(result.x) - 1])
n = round(result.x[len(result.x) - 2])
optimal_scenario = get_optimal_scenario(result.x)

scenario_NSSC['scenario'] = optimal_scenario
optimal_vectors = get_NSSC_vectors('Symmetrical', scenario_NSSC)

json_result = {'optimal_scenario': optimal_scenario, 'n': n, 'n_ref': n_ref, 'distance': result.fun, 'vectors': optimal_vectors}

print(json.dumps(json_result))

