import unittest

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


class Test_My_Python_Scripts(unittest.TestCase):
    def test_get_Information_Dai_Upper_PSMC(self):
        results = get_PSMC_results('Dai_upper.psmc', 'Dai_upper')

        is_Correct = results['rho'] == 0.008744363 and results['theta'] == 0.059070832 and results['x_vector'] == [0.0, 0.008822, 0.018421, 0.028868, 0.040236, 0.052607, 0.066069, 0.080719, 0.096661, 0.11401, 0.132889, 0.153433, 0.17579, 0.200119, 0.226594, 0.255405, 0.286757, 0.320875, 0.358003, 0.398406, 0.442373, 0.490219, 0.542285, 0.598945, 0.660603, 0.727699, 0.800715, 0.880172, 0.966639, 1.060733, 1.163128, 1.274555, 1.395812, 1.527766, 1.67136, 1.827621, 1.997667, 2.182714,2.384085, 2.60322, 2.841686, 3.101188, 3.383582, 3.690888, 4.025303, 4.389219, 4.785238, 5.216191, 5.685162, 6.195503, 6.750864, 7.355216, 8.012882, 8.728564, 9.50738, 10.3549, 11.277184, 12.280828, 13.373009, 14.561537, 15.854911, 17.262382, 18.794013, 20.460758] and results['y_vector'] == [1.46357, 1.46357, 1.46357, 1.46357, 0.664292, 0.664292, 0.199458, 0.199458, 0.236367, 0.236367, 0.355419, 0.355419, 0.611656, 0.611656, 1.127271, 1.127271, 1.950801, 1.950801, 2.603109, 2.603109, 2.858405, 2.858405, 2.872471, 2.872471, 2.582535, 2.582535, 2.139342, 2.139342, 1.739692, 1.739692,1.492824, 1.492824, 1.360287, 1.360287, 1.296925, 1.296925, 1.277224, 1.277224, 1.285103, 1.285103, 1.336026, 1.336026, 1.491424, 1.491424, 1.825889, 1.825889, 2.341814, 2.341814, 2.841183, 2.841183, 3.026724, 3.026724, 2.861561, 2.861561, 2.615608, 2.615608, 2.615608, 2.615608, 8.225243, 8.225243, 8.225243, 8.225243, 8.225243, 8.225243]

        self.assertTrue(is_Correct)
    
    def test_get_Information_Example_Output_MSMC(self):
        results = get_MSMC_results('example_output.msmc', 'example_output')

        is_Correct = results['x_vector'] == [0.0, 2.36759e-06, 4.79668e-06, 7.29055e-06, 9.85276e-06, 1.24872e-05, 1.51979e-05, 1.79896e-05, 2.08672e-05, 2.38362e-05, 2.69025e-05, 3.00728e-05, 3.33544e-05, 3.67553e-05, 4.02846e-05, 4.39523e-05, 4.77697e-05, 5.17497e-05, 5.59066e-05, 6.02569e-05, 6.48195e-05, 6.96162e-05, 7.46722e-05, 8.00174e-05, 8.56867e-05, 9.1722e-05, 9.81739e-05, 0.000105104, 0.000112589, 0.000120726, 0.000129639, 0.000139492, 0.000150506, 0.000162993, 0.000177409, 0.000194458, 0.000215326, 0.000242228, 0.000280145, 0.000344965] and results['y_vector'] == [157.897, 157.998, 158.452, 158.974, 159.508, 160.034, 160.577, 161.133, 161.701, 162.28, 163.182, 163.182, 164.409, 164.409, 165.699, 165.699, 167.052, 167.052, 168.479, 168.479, 169.993, 169.993, 171.611, 171.611, 173.356, 173.356, 175.263, 175.263, 177.382, 177.382, 179.793, 179.793, 182.645, 182.645, 186.258, 186.258, 191.651, 191.651, 236.919, 236.919]


if __name__ == "__main__":
    unittest.main()