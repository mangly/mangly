from model import NSSC, Pnisland
import sys, json

def compute_Distance(vectors, scenario_NSSC, n_ref):
    vectors = json.loads(vectors)
    scenario_NSSC = json.loads(scenario_NSSC)

    model_NSSC = Pnisland(scenario_NSSC)

    return model_NSSC.compute_distance(vectors['x'], vectors['y'], int(n_ref))

print(compute_Distance(sys.argv[1], sys.argv[2], sys.argv[3]))
