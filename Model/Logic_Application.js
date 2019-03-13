'use strict'

var fs = require('fs');
const Python_Communicator = require('../Utilities/Python_Communicator');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');
const NSSC = require('./NSSC');

class Application {
    constructor() {
        this.functions_collection = [];
        this.Mu = 1.25e-8;
        this.S = 100;
        this.N_ref = 500;
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

    Add_File_PSMC_MSMC(path_collection, callback) {
        Python_Communicator.get_File_Results(path_collection, 'Python_Scripts/get_File_Results.py', (results) => {
            for (const element of results.file_collection) {
                var funct;

                if (element.model == 'psmc') funct = new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho, this.Mu, this.S);
                else funct = new MSMC(element.name, element.time, element.IICR_k, this.Mu);

                if (!this.Contains(funct)) this.functions_collection.push(funct);
            }

            callback();
        });
    }

    Add_File_NSSC(path_collection, callback) {
        for (const path of path_collection) {
            Application.Load_File(path, (nssc_file) => {
                var path_split = path.split('/');
                var new_name = path_split[path_split.length - 1].slice(0, -5);

                var nssc_function = new NSSC(new_name, nssc_file.type, nssc_file.x_vector, nssc_file.IICR_specie, nssc_file.scenario, this.N_ref);

                if (!this.Contains(nssc_function)) this.functions_collection.push(nssc_function);
            });
        }

        setTimeout(function () { callback(); }, 100);
    }

    Get_NSSC_Vectors(type, name, scenario, callback) {
        Python_Communicator.get_Model_NSSC(type, scenario, 'Python_Scripts/get_Model_NSSC.py', (results) => {
            var nssc_function = this.Get_Function(name);
            if (nssc_function == null) {
                var nssc = new NSSC(name, type, results.x_vector, results.IICR_specie, scenario);
                if (!this.Contains(nssc)) this.functions_collection.push(nssc);
            }
            else {
                nssc_function.x_vector = results.x_vector;
                nssc_function.IICR_specie = results.IICR_specie;
                nssc_function.scenario = scenario;
            }

            callback(nssc_function);
        });
    }

    Compute_Distance(vectors, scenario_NSSC, n_ref, callback) {
        Python_Communicator.compute_Distance(vectors, scenario_NSSC, n_ref, 'Python_Scripts/compute_Distance.py', (results) => {
            callback(results)
        });
    }

    Scale_Psmc_Function(funct, mu = this.Mu, s = this.S) {
        for (let index = 0; index < funct.time.length; index++) {
            var N = funct.theta / (4 * mu * s);
            funct.time[index] = 2 * N * funct.time[index];
            funct.IICR_2[index] = N * funct.IICR_2[index];
            // funct.Mu = mu;
            // funct.S = s;
        }

        // return funct;
    }

    Scale_Msmc_Function(funct, mu = this.Mu) {
        for (let index = 0; index < funct.time.length; index++) {
            funct.time[index] = funct.time[index] / mu;
            funct.IICR_k[index] = 1 / funct.IICR_k[index] / (2 * mu);
            // funct.Mu = mu;
        }

        // return funct;
    }

    Scale_NSSC_Function(funct, N_ref = this.N_ref) {
        for (let index = 0; index < funct.x_vector.length; index++) {
            funct.x_vector[index] = funct.x_vector[index] * 2 * N_ref;
            funct.IICR_specie[index] = funct.IICR_specie[index] * N_ref;
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
        // var last_nssc;
        // for (const element of this.functions_collection) {
        //     if (element.model == 'nssc') {
        //         last_nssc = element;
        //     }
        // }

        return this.functions_collection[this.functions_collection.length - 1];
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

    static Build_Symmetrical_Scenario_NSSC(n, sampling_vector, count) {
        var scenario = [];
        var time_of_change = 0;
        var M = 0;
        var c = 0;
        for (let index = 0; index < count; index++) {
            var content_of_scenario = { "time": 0, "n": n, "M": 0, "c": 0 };

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

    static Build_Scenario_Update(type_nssc_model, matrix_collection, deme_vector_collection, sampling_vector, order, count){
        if (type_nssc_model == 'General') return Application.Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector);
        else return Application.Build_Symmetrical_Scenario_NSSC(order, sampling_vector, count);
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