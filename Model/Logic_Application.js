'use strict'

var fs = require('fs');
const Python_Communicator = require('../Utilities/Python_Communicator');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');
const NSSC = require('./NSSC');

class Application {
    constructor() {
        this.functions_collection = [];
        this.Mu = 1.25;
        this.S = 100;
        this.N_ref = 500;
        this.path = null;
        this.python_communicator = new Python_Communicator();
    }

    Contains(funct) {
        for (const element of this.functions_collection) {
            if (funct.model == element.model && funct.Equals(element)) return true;
        }

        return false;
    }

    Get_Function(element_name) {
        for (let index = 0; index < this.functions_collection.length; index++) {
            const element = this.functions_collection[index];

            if (element.name == element_name) return element;
        }

        return null;
    }

    Add_File_PSMC(path, name, callback) {
        this.python_communicator.get_Model_PSMC(path, name, 'Python_Scripts/get_Model_PSMC.py', (element) => {
            var error = false;
            var funct = new PSMC(element.name, element.x_vector, element.y_vector, element.theta, element.rho, this.Mu, this.S, null);

            if (!this.Contains(funct)) this.functions_collection.push(funct);
            else error = true;

            callback(error);
        });
    }

    Add_File_MSMC(path, name, callback) {
        this.python_communicator.get_Model_MSMC(path, name, 'Python_Scripts/get_Model_MSMC.py', (element) => {
            var error = false;
            var funct = new MSMC(element.name, element.x_vector, element.y_vector, this.Mu, null);

            if (!this.Contains(funct)) this.functions_collection.push(funct);
            else error = true;

            callback(error);
        });
    }

    Add_File_PSMCP(path, callback) {
        var error = false;
        Application.Load_File(path, (element) => {
            var funct = new PSMC(element.name, element.x_vector, element.y_vector, element.theta, element.rho, element.Mu, element.S, path);

            if (!this.Contains(funct)) this.functions_collection.push(funct);
            else error = true;
        });


        setTimeout(function () { callback(error); }, 100);
    }

    Add_File_MSMCP(path, callback) {
        var error = false;
        Application.Load_File(path, (element) => {
            var funct = new MSMC(element.name, element.x_vector, element.y_vector, element.Mu, path);

            if (!this.Contains(funct)) this.functions_collection.push(funct);
            else error = true;
        });

        setTimeout(function () { callback(error); }, 100);
    }

    Add_File_NSSC(path, callback) {
        var error = false;
        Application.Load_File(path, (nssc_file) => {
            var nssc_function = new NSSC(nssc_file.name, nssc_file.type, nssc_file.x_vector, nssc_file.y_vector, nssc_file.scenario, nssc_file.N_ref, path);

            if (!this.Contains(nssc_function)) this.functions_collection.push(nssc_function);
            else error = true;
        });

        setTimeout(function () { callback(error); }, 100);
    }

    Add_Files(path, callback) {
        this.functions_collection = [];
        Application.Load_File(path, (application) => {
            var funct;
            this.path = path;
            for (const element of application.functions_collection) {
                if (element.model == 'psmc') funct = new PSMC(element.name, element.x_vector, element.y_vector, element.theta, element.rho, element.Mu, element.S, element.path);
                else if(element.model == 'msmc') funct = new MSMC(element.name, element.x_vector, element.y_vector, element.Mu, element.path);
                else funct = new NSSC(element.name, element.type, element.x_vector, element.y_vector, element.scenario, element.N_ref, element.path);

                this.functions_collection.push(funct);
            }
        });

        setTimeout(function () { callback(); }, 100);
    }

    Get_NSSC_Vectors(type, name, scenario, callback) {
        this.python_communicator.get_Model_NSSC(type, scenario, 'Python_Scripts/get_Model_NSSC.py', (results) => {
            var nssc_function = this.Get_Function(name);
            if (!nssc_function) {
                var nssc = new NSSC(name, type, results.x_vector, results.y_vector, scenario, this.N_ref, null);
                if (!this.Contains(nssc)) this.functions_collection.push(nssc);
            }

            else this.Update_NSSC(nssc_function, scenario, results);
            callback(nssc_function);
        });
    }

    Update_NSSC(nssc_function, scenario, vectors_results) {
        nssc_function.x_vector = vectors_results.x_vector;
        nssc_function.y_vector = vectors_results.y_vector;
        nssc_function.scenario = scenario;
    }

    Get_Optimal_Values_Metaheuristics(vectors, scenario_NSSC, n_ref, metaheuristic_name, callback) {
        if (metaheuristic_name == 'Differential Evolution') {
            this.python_communicator.get_Optimal_Values_Metaheuristic_DE(vectors, scenario_NSSC, n_ref, 'Python_Scripts/Differential_Evolution.py', (results) => {
                callback(results)
            });
        }

        else {
            this.python_communicator.get_Optimal_Values_Metaheuristic_PSO(vectors, scenario_NSSC, n_ref, 'Python_Scripts/pso.py', (results) => {
                callback(results)
            });
        }
    }

    Compute_Distance(vectors, scenario_NSSC, n_ref, callback) {
        this.python_communicator.compute_Distance(vectors, scenario_NSSC, n_ref, 'Python_Scripts/compute_Distance.py', (results) => {
            callback(results)
        });
    }

    Scale_Psmc_Function(funct, mu = this.Mu * 1e-8, s = this.S) {
        for (let index = 0; index < funct.x_vector.length; index++) {
            var N = funct.theta / (4 * mu * s);
            funct.x_vector[index] = 2 * N * funct.x_vector[index];
            funct.y_vector[index] = N * funct.y_vector[index];
            // funct.Mu = mu;
            // funct.S = s;
        }

        // return funct;
    }

    Scale_Msmc_Function(funct, mu = this.Mu * 1e-8) {
        for (let index = 0; index < funct.x_vector.length; index++) {
            funct.x_vector[index] = funct.x_vector[index] / mu;
            funct.y_vector[index] = 1 / funct.y_vector[index] / (2 * mu);
            // funct.Mu = mu;
        }

        // return funct;
    }

    Scale_NSSC_Function(funct, N_ref = this.N_ref) {
        for (let index = 0; index < funct.x_vector.length; index++) {
            funct.x_vector[index] = funct.x_vector[index] * 2 * N_ref;
            funct.y_vector[index] = funct.y_vector[index] * N_ref;
        }
    }

    Get_NSSC_Function(name) {
        for (const element of this.functions_collection) {
            if (element.model == 'nssc' && element.name == name) {
                return element;
            }
        }

        return null;
    }

    Get_Last_Function() {
        return this.functions_collection[this.functions_collection.length - 1];
    }

    Stop_Python_Communicator(){
        this.python_communicator.kill_Process('Differential_Evolution.py');
    }

    static Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector) {
        var scenario = [];
        var time_of_change = 0;

        for (let index = 0; index < matrix_collection.length; index++) {
            var content_of_scenario = { "time": 0, "demeSizes": [], "migMatrix": [] };
            const matrix = matrix_collection[index];
            const deme_sizes = deme_vector_collection[index];

            time_of_change = parseFloat($('#time' + index).val());

            content_of_scenario.migMatrix = matrix.jexcel('getData', false);
            content_of_scenario.time = time_of_change;

            content_of_scenario.demeSizes = deme_sizes.jexcel('getRowData', 0);

            scenario.push(content_of_scenario);
        }

        return { "samplingVector": sampling_vector, "scenario": scenario };
    }

    static Build_Symmetrical_Scenario_NSSC(sampling_vector, count) {
        var scenario = [];
        var time_of_change = 0;
        var M = 0;
        var c = 0;
        for (let index = 0; index < count; index++) {
            var content_of_scenario = { "time": 0, "n": sampling_vector.length, "M": 0, "c": 0 };

            time_of_change = parseFloat($('#time' + index).val());
            M = parseFloat($('#M' + index).val());
            c = parseFloat($('#c' + index).val());

            content_of_scenario.time = time_of_change;
            content_of_scenario.M = M;
            content_of_scenario.c = c;

            scenario.push(content_of_scenario);
        }

        return { "samplingVector": sampling_vector, "scenario": scenario };
    }

    static Build_Scenario_Update(type_nssc_model, matrix_collection, deme_vector_collection, sampling_vector, count) {
        if (type_nssc_model == 'General') return Application.Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector);
        else return Application.Build_Symmetrical_Scenario_NSSC(sampling_vector, count);
    }


    static Load_General_Scenario(scenario, sampling_vector, matrix_collection, deme_vector_collection) {
        for (let index = 0; index < matrix_collection.length; index++) {
            const matrix = matrix_collection[index];
            const deme_sizes = deme_vector_collection[index];

            matrix.jexcel('setData', scenario.scenario[index].migMatrix, false);
            deme_sizes.jexcel('setData', [scenario.scenario[index].demeSizes], false);
            sampling_vector.jexcel('setData', [scenario.samplingVector], false);
            if (index != 0) $('#time' + index).val(scenario.scenario[index].time);
        }
    }

    static Load_General_Scenario_mejorado(scenario, sampling_vector) {
        for (let index = 0; index < matrix_collection.length; index++) {
            const matrix = matrix_collection[index];
            const deme_sizes = deme_vector_collection[index];

            matrix.jexcel('setData', scenario.scenario[index].migMatrix, false);
            deme_sizes.jexcel('setData', [scenario.scenario[index].demeSizes], false);
            sampling_vector.jexcel('setData', [scenario.samplingVector], false);
            if (index != 0) $('#time' + index).val(scenario.scenario[index].time);
        }
    }

    static Load_Symmetrical_Scenario(scenario, sampling_vector) {
        for (let index = 0; index < scenario.scenario.length; index++) {
            sampling_vector.jexcel('setData', [scenario.samplingVector], false);

            if (index != 0) $('#time' + index).val(scenario.scenario[index].time);
            $('#n' + index).val(scenario.scenario[index].n);
            $('#M' + index).val(scenario.scenario[index].M);
            $('#c' + index).val(scenario.scenario[index].c);
        }
    }

    static Load_File(path, callback) {
        fs.readFile(path, function read(err, data) {
            if (err) {
                throw err;
            }

            callback(JSON.parse(data));
        });
    }

    static Save_File(filename, file) {
        fs.writeFile(filename, file, function (err) {
            if (err) {
                throw err;
            }
        });
    }
}

module.exports = Application