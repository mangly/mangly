import sys, json

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

path = sys.argv[1]
name = sys.argv[2]

print(json.dumps(get_MSMC_results(path, name)))