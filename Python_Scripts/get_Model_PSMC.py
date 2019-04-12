import sys, json

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

    return {'name': name, 'model':'psmc', 'time' : time, 'IICR_2': IICR_2, 'theta': theta, 'rho': rho}

path = sys.argv[1]
name = sys.argv[2]

print(json.dumps(get_PSMC_results(path, name)))



