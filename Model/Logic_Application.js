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
        var err;
        Python_Communicator.get_File_Results(path_collection[0], 'Python_Scripts/get_File_Results.py', (results) => {
            for (const element of results.file_collection) {
                var funct;

                if (element.model == 'psmc') funct = new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho, this.Mu, this.S);
                else funct = new MSMC(element.name, element.time, element.IICR_k, this.Mu);

                if (!this.Contains(funct)) this.functions_collection.push(funct);

                else if (path_collection[0].length + path_collection[1].length == 1) err = 'The selected function already exists (has the same name or the same behavior)';
            }

            callback(err);
        });
    }

    Add_File_NSSC(path_collection, callback) {
        var err;
        for (const path of path_collection[1]) {
            Application.Load_File(path, (nssc_file) => {
                var path_split = path.split('/');
                var new_name = path_split[path_split.length - 1].slice(0, -5);
                if (!this.Is_NSSC_Corrupted_File(new_name, nssc_file.name)) {

                    var nssc_function = new NSSC(new_name, nssc_file.x_vector, nssc_file.IICR_specie, nssc_file.scenario);

                    if (!this.Contains(nssc_function)) this.functions_collection.push(nssc_function);

                    else {
                        if (this.All_Files_Exist(path_collection[1])){
                           err = 'All selected files exist (The functions has the same name or the same behavior)'; 
                           return;
                        } 
                        
                    }
                }

                else {
                    err = 'File selected is corrupted';
                    return;
                }
            });

            if (err == 'File selected is corrupted') break;
        }

        setTimeout(function () { callback(err); }, 0 | Math.random() * 100);
    }

    Get_NSSC_Vectors(json, callback) {
        Python_Communicator.get_Model_NSSC(json, 'Python_Scripts/get_Model_NSSC.py', (results) => {
            var nssc_function = this.Get_Function(json.name);
            if (nssc_function == null) {
                var nssc = new NSSC(json.name, results.x_vector, results.IICR_specie, json);
                this.functions_collection.push(nssc);
            }
            else {
                nssc_function.x_vector = results.x_vector;
                nssc_function.IICR_specie = results.IICR_specie;
                nssc_function.scenario = json;
            }

            callback(nssc_function);
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

    Is_NSSC_Corrupted_File(name_file, nssc_scenario_name) {
        return name_file != nssc_scenario_name;
    }

    All_Files_Exist(file_collection) {
        for (const element of file_collection) {
            var path_split = element.split('/');
            var new_name = path_split[path_split.length - 1].slice(0, -5);

            var funct = new NSSC(new_name, );
            console.log(funct)
            console.log(this.Contains(funct))
            // if (!this.Contains(new_name)) return false;
        }

        return true;
    }
}

module.exports = Application