from __future__ import division
import math, sys, json, random
from model import Pnisland
from get_File_Results import get_NSSC_vectors
from metaheuristics_utilities import get_scenario, multi_dim_conversion, valid_state, get_optimal_scenario, best_initial_n_ref, get_best_values, get_initial_bounds, get_initial_state

vectors = json.loads(sys.argv[1])
scenario_NSSC = json.loads(sys.argv[2])
#--- COST FUNCTION ------------------------------------------------------------+

# function we are attempting to optimize (minimize)
def compute_distance(state):
    multi_state = multi_dim_conversion(state, 3)

    if(valid_state(multi_state)):  
        nssc_model = Pnisland(get_scenario(scenario_NSSC, state))
        d = nssc_model.compute_distance(vectors['x'], vectors['y'], state[len(state) - 1])
        return d

    return 10000000000000000000

#--- MAIN ---------------------------------------------------------------------+

class Particle:
    def __init__(self,x0):
        self.position_i=[]          # particle position
        self.velocity_i=[]          # particle velocity
        self.pos_best_i=[]          # best position individual
        self.err_best_i=-1          # best error individual
        self.err_i=-1               # error individual

        for i in range(0,num_dimensions):
            self.velocity_i.append(random.uniform(-1,1))
            self.position_i.append(x0[i])

    # evaluate current fitness
    def evaluate(self,costFunc):
        self.err_i=costFunc(self.position_i)

        # check to see if the current position is an individual best
        if self.err_i < self.err_best_i or self.err_best_i==-1:
            self.pos_best_i=self.position_i
            self.err_best_i=self.err_i

    # update new particle velocity
    def update_velocity(self,pos_best_g):
        w=0.5       # constant inertia weight (how much to weigh the previous velocity)
        c1=1        # cognative constant
        c2=2        # social constant

        for i in range(0,num_dimensions):
            r1=random.random()
            r2=random.random()

            vel_cognitive=c1*r1*(self.pos_best_i[i]-self.position_i[i])
            vel_social=c2*r2*(pos_best_g[i]-self.position_i[i])
            self.velocity_i[i]=w*self.velocity_i[i]+vel_cognitive+vel_social

    # update the particle position based off new velocity updates
    def update_position(self,bounds):
        for i in range(0,num_dimensions):
            self.position_i[i]=self.position_i[i]+self.velocity_i[i]

            # adjust maximum position if necessary
            if self.position_i[i]>bounds[i][1]:
                self.position_i[i]=bounds[i][1]

            # adjust minimum position if neseccary
            if self.position_i[i] < bounds[i][0]:
                self.position_i[i]=bounds[i][0]
                
class PSO():
    def __init__(self,costFunc,x0,bounds,num_particles,maxiter):
        global num_dimensions

        num_dimensions=len(x0)
        err_best_g=-1                   # best error for group
        pos_best_g=[]                   # best position for group

        # establish the swarm
        swarm=[]
        for i in range(0,num_particles):
            swarm.append(Particle(x0))

        # begin optimization loop
        i=0
        while i < maxiter:
            #print i,err_best_g
            # cycle through particles in swarm and evaluate fitness
            for j in range(0,num_particles):
                swarm[j].evaluate(costFunc)

                # determine if current particle is the best (globally)
                if swarm[j].err_i < err_best_g or err_best_g == -1:
                    pos_best_g=list(swarm[j].position_i)
                    err_best_g=float(swarm[j].err_i)

            # cycle through swarm and update velocities and position
            for j in range(0,num_particles):
                swarm[j].update_velocity(pos_best_g)
                swarm[j].update_position(bounds)
            i+=1

        # print final results
        # print('FINAL:')
        # print(pos_best_g)
        # print(err_best_g)
        n_ref = round(pos_best_g[len(pos_best_g) - 1])
        n = round(pos_best_g[len(pos_best_g) - 2])
        optimal_scenario = get_optimal_scenario(pos_best_g)

        scenario_NSSC['scenario'] = optimal_scenario
        optimal_vectors = get_NSSC_vectors('Symmetrical', scenario_NSSC)

        json_result = {'optimal_scenario': scenario_NSSC, 'n_ref': n_ref, 'distance': err_best_g, 'vectors': optimal_vectors}

        print(json.dumps(json_result))

if __name__ == "__PSO__":
    main()


#--- RUN ----------------------------------------------------------------------+
# new_scenario = {'samplingVector': [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'scenario':[{'time': 0, 'n':15, 'M':1, 'c':1}, {'time':10, 'n':15, 'M':50, 'c':1}, {'time':50, 'n':15, 'M':1, 'c':1}]}

# variables_count = (len(new_scenario['scenario']) * 3) + 2
# init_state = get_initial_random_state(new_scenario)

# initial=[0,1,1,10,50,1,50,1,1,15,464]   
 
bounds = get_initial_bounds(scenario_NSSC, vectors['x'], vectors['y'])
initial=get_initial_state(scenario_NSSC, bounds[1]) 
# bounds=[(0, 0), (1, 50), (1,5), (1, 50), (1, 50), (1,5), (2, 50), (1, 50), (1,5), (2,20), (500, 1000)]  # input bounds [(x1_min,x1_max),(x2_min,x2_max)...]
PSO(compute_distance, initial, bounds[0], num_particles=20, maxiter=80)

