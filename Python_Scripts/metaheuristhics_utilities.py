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

        M = multi_state[i][1]
        c = multi_state[i][2]

        
        if(multi_state[0][0] != 0 or time < 0 or time >= 100 or time > next_time or M < 1 or M > 100 or c < 1 or c > 1000 or n_ref < 1 or n_ref > 10000 or n < 2 or n > 1000):
            return False
        
    return True

def get_optimal_scenario(ndarray):
    result = []
    result_content = {}
    multi_ndarray = multi_dim_conversion(ndarray, 3)
    n = multi_ndarray[len(multi_ndarray)-1][0]
    # n_ref = multi_ndarray[len(multi_ndarray)-1][1]

    for i in range(0, len(multi_ndarray) - 1):
        result_content['time'] = multi_ndarray[i][0]
        result_content['n'] = n
        result_content['M'] = multi_ndarray[i][1]
        result_content['c'] = multi_ndarray[i][2]
        result.append(result_content.copy())
    
    # result['n_ref'] = n_ref
    return result