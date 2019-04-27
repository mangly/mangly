import numpy as np
from model import NSSC, Pnisland

def get_PSMC_results(filename, name):
    """
    Read the final output of PSMC and return a dictionary of
    six elements: name, model, the time vector, the IICR_2 vector, 
    the value of theta and the value of rho
    """
    text = ""
    with open(filename, "r") as f:
        text = f.read()
    results_block = text.split("//\n")[-2]
    time = []
    IICR_2 = []
    for line in results_block.split('\n'):
        if line[0:2] == "RS":
            values = line.split("\t")
            time.append(float(values[2]))
            IICR_2.append(float(values[3]))
    # Get the theta and rho values
    theta_rho_line = text.split("PA\t")[-1]
    theta_rho_line.split("\n")[0]
    (theta, rho) = theta_rho_line.split(" ")[1:3]
    theta = float(theta)
    rho = float(rho)

    return {'name': name, 'model':'psmc', 'x_vector' : time, 'y_vector': IICR_2, 'theta': theta, 'rho': rho}

def get_MSMC_results(filename, name):
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

    return {'name': name, 'model':'msmc', 'x_vector' : time, 'y_vector': IICR_k}

def get_NSSC_vectors(type, scenario, start = 0, end = 500, n = 500):
    model = 'initializing'

    if(type == "General"):
        model = NSSC(scenario)

    elif(type == 'Symmetrical'):
        model = Pnisland(scenario)

    x_vector = [0.1*(np.exp(i * np.log(1+10*end)/n)-1) for i in range(n+1)]
    IICR_specie = list(model.evaluateIICR(x_vector))

    return {'x_vector': x_vector, 'y_vector': IICR_specie}