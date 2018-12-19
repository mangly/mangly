import sys
import json
import random

def get_PSMC_results(filename):
    """
    Read the final output of PSMC and return a tuple of
    four elements: the time vector, the IICR_2 vector, 
    the value of theta and the value of rho
    (time, IICR_2, theta, rho)
    """
    text = ""
    with open(filename, "r") as f:
        text = f.read()
    results_block = text.split("//\n")[-2]
    time = []
    IICR_2 = []
    x_y = []
    time_IICR_2 = {'data':'', 'label':'','fill':'false', 'borderColor': '', 'backgroundColor': '', 'borderWidth': '2', 'steppedLine': 'true'}

    for line in results_block.split('\n'):
        if line[0:2] == "RS":
            values = line.split("\t")
            time.append(float(values[2]))
            IICR_2.append(float(values[3]))
            x_y.append({'x':float(values[2]), 'y': float(values[3])})

    time_IICR_2['data']=x_y


    # Get the theta and rho values
    theta_rho_line = text.split("PA\t")[-1]
    theta_rho_line.split("\n")[0]
    (theta, rho) = theta_rho_line.split(" ")[1:3]
    theta = float(theta)
    rho = float(rho)

    return {'time':time, 'IICR_2':IICR_2, 'theta': theta, 'rho': rho, 'x_y':time_IICR_2, 'extension':'.psmc'}

def get_MSMC_results(filename):
    """
    Read the final output of MSMC and return a tuple
    containing two list (time, IICR_k)
    """
    lines = []
    with open(filename, "r") as f:
        for line in f:
            lines.append(line)
    time = [v.split('\t')[1] for v in lines]
    time = [float(v) for v in time[1:]]
    IICR_k = [v.split('\t')[3] for v in lines]
    IICR_k = [float(v) for v in IICR_k[1:]]
    x_y = []
    time_IICR_k = {'data':'', 'label':'','fill':'false', 'borderColor': '', 'backgroundColor': '', 'borderWidth': '1', 'steppedLine': 'true'}

    for i in range(0,time.__len__()):
        x_y.append({'x':time[i], 'y':IICR_k[i]})

    time_IICR_k['data'] = x_y

    return {'time':time, 'IICR_k':IICR_k, 'x_y':time_IICR_k, 'extension':'.msmc'}

def get_File_collection_result(path_collection):
    file_collection = []

    for i in range(1, path_collection.__len__()):
        path = path_collection[i]
        file_result = {}
        tmp = path.split('/')
        label = tmp[tmp.__len__()-1]
        name = label[:label.find('.')]

        if(label.endswith('psmc')):
            file_result = get_PSMC_results(path)
        
        elif(label.endswith('msmc') or label.endswith('txt')):
            file_result = get_MSMC_results(path)

        
        x_y = file_result['x_y']
        r = lambda: random.randint(0,255)
        x_y['borderColor']='#%02X%02X%02X' % (r(),r(),r())
        x_y['backgroundColor']=x_y['borderColor']
        x_y['label'] = name
        file_collection.append(file_result)
    
    return {'file_collection': file_collection}


print(json.dumps(get_File_collection_result(sys.argv)))


