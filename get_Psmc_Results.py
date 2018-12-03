import sys
import json

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
    time_IICR_2 = {'data':'', 'label':'','fill':'false', 'borderColor': ''}

    for line in results_block.split('\n'):
        if line[0:2] == "RS":
            values = line.split("\t")
            time.append(float(values[2]))
            IICR_2.append(values[3])
            x_y.append({'x':float(values[2]), 'y': float(values[3])})

    time_IICR_2['data']=x_y


    # Get the theta and rho values
    theta_rho_line = text.split("PA\t")[-1]
    theta_rho_line.split("\n")[0]
    (theta, rho) = theta_rho_line.split(" ")[1:3]
    theta = float(theta)
    rho = float(rho)

    #return(time, IICR_2, theta, rho)
    return(time_IICR_2, theta, rho)

path = str(sys.argv[1])

print(json.dumps(get_PSMC_results(path)[0]))
print(get_PSMC_results(path)[1])
print(get_PSMC_results(path)[2])

