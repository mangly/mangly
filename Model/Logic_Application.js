'use strict'

const Python_Communicator = require('../Utilities/Python_Communicator');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');
const NSSC = require('./NSSC');

class Application {
    constructor() {
        this.functions_collection = [];
        this.Mu = 1.25e-8;
        this.S = 100;
    }

    Get_Function(element_name) {
        for (let index = 0; index < this.functions_collection.length; index++) {
            const element = this.functions_collection[index];

            if (element.name == element_name) return element;
        }

        return null;
    }

    Add_File(path_collection, callback) {
        Python_Communicator.get_File_Results(path_collection, 'Python_Scripts/get_File_Results.py', (results) => {
            for (const element of results.file_collection) {
                if (this.Get_Function(element.name) == null) {
                    if (element.model == 'psmc') {
                        var psmc = new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho, this.Mu, this.S);
                        this.functions_collection.push(psmc);
                    }

                    else {
                        var msmc = new MSMC(element.name, element.time, element.IICR_k, this.Mu);
                        this.functions_collection.push(msmc);
                    }
                }
            }

            callback();
        });
    }

    Get_NSSC_Vectors(json, callback) {
        Python_Communicator.get_Model_NSSC(json, 'Python_Scripts/get_Model_NSSC.py', (results) => {
            var nssc = new NSSC(json.name, results.x_vector, results.IICR_specie, json);
            this.functions_collection.push(nssc);
            callback();
        })
    }

    Scale_Psmc_Function(funct, mu = this.Mu, s = this.S) {
        for (let index = 0; index < funct.time.length; index++) {
            var N = funct.theta / (4 * mu * s);
            funct.time[index] = 2 * N * funct.time[index];
            funct.IICR_2[index] = N * funct.IICR_2[index];
            funct.Mu = mu;
            funct.S = s;
        }

        // return funct;
    }

    Scale_Msmc_Function(funct, mu = this.Mu) {
        for (let index = 0; index < funct.time.length; index++) {
            funct.time[index] = funct.time[index] / mu;
            funct.IICR_k[index] = 1 / funct.IICR_k[index] / (2 * mu);
            funct.Mu = mu;
        }

        // return funct;
    }

    Get_NSSC_Function(name) {
        for (const element of this.functions_collection) {
            if (element.model == 'nssc' && element.name == name) {
                return element;
            }
        }

        return null;
    }

    Get_Last_NSSC_Function() {
        var last_nssc;
        for (const element of this.functions_collection) {
            if (element.model == 'nssc') {
                last_nssc = element;
            }
        }

        return last_nssc;
    }

    static Build_Scenario_NSSC(name, matrix_collection, deme_vector_collection, sampling_vector) {
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

        return { "name": name, "samplingVector": sampling_vector, "scenario": scenario };
    }

    static Load_Scenario(scenario, sampling_vector, matrix_collection, deme_vector_collection) {
        for (let index = 0; index < matrix_collection.length; index++) {
            const matrix = matrix_collection[index];
            const deme_sizes = deme_vector_collection[index];

            matrix.jexcel('setData', scenario.scenario[index].migMatrix, false);
            deme_sizes.jexcel('setData', [scenario.scenario[index].demeSizes], false);
            sampling_vector.jexcel('setData', [scenario.samplingVector], false);
            if (index != 0) $('#time' + index).val(scenario.scenario[index].time);
        }
    }
}

module.exports = Application