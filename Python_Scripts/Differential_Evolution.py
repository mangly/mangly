from scipy.optimize import differential_evolution
import numpy as np
from model import NSSC, Pnisland
from get_File_Results import get_PSMC_results
import random

def get_initial_random_state(scenario):
    initial_state = []

    for i in range(0, len(scenario['scenario'])):
        if(i==0):
            initial_state.append(0)        
        else:
           initial_state.append(round(random.uniform(1, 100), 2))

        initial_state.append(round(random.uniform(1,100), 2))
        initial_state.append(round(random.uniform(1, 1000), 2))

    initial_state.append(round(random.uniform(2, 1000), 2))
    initial_state.append(round(random.uniform(1, 10000), 2))

    return initial_state

def get_initial_state(scenario, n_ref):
    initial_state = []

    for i in range(0, len(scenario['scenario'])):
        initial_state.append(scenario['scenario'][i]['time'])
        initial_state.append(scenario['scenario'][i]['M'])
        initial_state.append(scenario['scenario'][i]['c'])
    
    initial_state.append(scenario['scenario'][0]['n'])
    initial_state.append(n_ref)

    return initial_state


def get_scenario(json, state):
    new_json = {'samplingVector': json['samplingVector']}
    new_scenario = []
    old_scenario = json['scenario']

    index = 0
    n = state[len(state) - 2]
    for i in range(0, len(old_scenario)):
        # old_scenario_content_modified = old_scenario[i].copy()
        old_scenario_content_modified = {'time':state[index], 'n': n, 'M':state[index + 1], 'c':state[index + 2]}
        new_scenario.append(old_scenario_content_modified)
        index += 3
    
    new_json['scenario'] = new_scenario

    return new_json


def multi_dim_conversion(state, split_position):
    count = 1
    temp = []
    result = []

    for i in state:
        if(count <= split_position):
            temp.append(i)
            count+=1
        else:
            result.append(temp)
            count = 2
            temp = [i]            

    if(count>1): 
        result.append(temp)

    return result


def valid_state(multi_state):
    next_time = 0
    n = multi_state[len(multi_state)-1][0]
    n_ref = multi_state[len(multi_state)-1][1]

    for i in range(0, len(multi_state) - 1):
        time = multi_state[i][0]
        
        if(len(multi_state[i + 1]) != 2):
            next_time = multi_state[i + 1][0]

        M= multi_state[i][1]
        c = multi_state[i][2]

        
        if(multi_state[0][0] != 0 or time < 0 or time >= 100 or time > next_time or M < 1 or M > 100 or c < 1 or c > 1000 or n_ref < 1 or n_ref > 10000 or n < 2 or n > 1000):
            return False
        
    return True

psmc = get_PSMC_results('./experiment_1.psmc')

mu = 1.25e-8
s = 100
Nref = psmc['theta']/(4*mu*s)

x_vector = [2*Nref*i for i in psmc['time']]
y_vector = [Nref*i for i in psmc['IICR_2']]

new_scenario = {'samplingVector': [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'scenario':[{'time': 0, 'n':15, 'M':1, 'c':1}, {'time':10, 'n':15, 'M':50, 'c':1}, {'time':50, 'n':15, 'M':1, 'c':1}]}

variables_count = (len(new_scenario['scenario']) * 3) + 2
init_state = get_initial_state(new_scenario, 500)

def compute_distance(state):
    multi_state = multi_dim_conversion(state, 3)

    if(valid_state(multi_state)):  
        # scenario = get_scenario(new_scenario, state)                                                                                            {'time':state[4], 'n':state[5], 'M':state[6], 'c':state[7]},{'time':state[8], 'n':state[5], 'M':state[9], 'c':state[10]}]}
        nssc_model = Pnisland(get_scenario(new_scenario, state))
        d = nssc_model.compute_distance(x_vector, y_vector, state[len(state) - 1])
        return d

    return 10000000000000000000

# def ackley(x):
#     arg1 = -0.2 * np.sqrt(0.5 * (x[0] ** 2 + x[1] ** 2))
#     arg2 = 0.5 * (np.cos(2. * np.pi * x[0]) + np.cos(2. * np.pi * x[1]))
#     return -20. * np.exp(arg1) - np.exp(arg2) + 20. + np.e

# bounds = [(-5, 5), (-5, 5)]
# result = differential_evolution(ackley, bounds)

# state = [1,2,3]
# def test(state):
#     return sum(state)

bounds = [(0, 0), (1, 50), (1,5), (1, 50), (1, 50), (1,5), (2, 50), (1, 50), (1,5), (2,20), (1, 1000)]
result = differential_evolution(compute_distance, bounds, maxiter = 1000, popsize = 15, mutation = (0.5,1), recombination = 0.7)
print(result.x, result.fun)

