import sys, json
from scipy.optimize import differential_evolution
# import numpy as np
from model import Pnisland
# from get_File_Results import get_PSMC_results
# import random
from metaheuristics_utilities import get_scenario, multi_dim_conversion, valid_state, get_optimal_scenario, best_initial_n_ref, get_best_values, get_initial_bounds, get_NSSC_vectors
# from get_Model_NSSC import get_NSSC_vectors

model_type = sys.argv[2]
scenario = json.loads(sys.argv[1])

vectors = json.loads(sys.argv[1])
scenario_NSSC = json.loads(sys.argv[2])

def compute_distance(state):
    multi_state = multi_dim_conversion(state, 3)

    if(valid_state(multi_state)):  
        nssc_model = Pnisland(get_scenario(scenario_NSSC, state))
        d = nssc_model.compute_distance(vectors['x'], vectors['y'], state[len(state) - 1])
        return d

    return 10000000000000000000

# bounds = [(0, 0), (1, 50), (1,5), (1, 50), (1, 50), (1,5), (2, 50), (1, 50), (1,5), (2,20), (1, 1000)]
bounds = get_initial_bounds(scenario_NSSC, vectors['x'], vectors['y'])

result = differential_evolution(compute_distance, bounds[0], maxiter = 1000, popsize = 15, mutation = (0.5,1), recombination = 0.7)

n_ref = round(result.x[len(result.x) - 1])
n = round(result.x[len(result.x) - 2])
optimal_scenario = get_optimal_scenario(result.x)

scenario_NSSC['scenario'] = optimal_scenario
optimal_vectors = get_NSSC_vectors('Symmetrical', scenario_NSSC)

json_result = {'optimal_scenario': scenario_NSSC, 'n_ref': n_ref, 'distance': result.fun, 'vectors': optimal_vectors}

print(json.dumps(json_result))

