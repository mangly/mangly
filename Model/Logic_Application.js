'use strict'

const Python_Communicator = require('./Python_Communicator');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');

class Application {
    constructor() {
        this.functions_collection = [];
    }

    Contain(element_name) {
        for (let index = 0; index < this.functions_collection.length; index++) {
            const element = this.functions_collection[index];

            if (element.name && (element.name == element_name)) return true;
        }

        return false;
    }

    Add_File(path_collection, callback) {
        Python_Communicator.get_File_Results(path_collection, 'get_File_Results.py', (results) => {

            for (const element of results.file_collection) {
                if (!this.Contain(element.name)) {
                    if (element.model == 'psmc') {
                        var psmc = new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho);
                        this.functions_collection.push(psmc);
                    }

                    else {
                        var msmc = new MSMC(element.name, element.time, element.IICR_k);
                        this.functions_collection.push(msmc);
                    }
                }
            }

            callback();
        })
    }

    Scale_Psmc_Function(funct, mu = 1.25e-8, s = 100) {
        for (let index = 0; index < funct.time.length; index++) {
            var N = funct.theta / (4 * mu * s);
            funct.time[index] = 2 * N * funct.time[index];
            funct.IICR_2[index] = N * funct.IICR_2[index];
        }

        return funct;
    }

    Scale_Msmc_Function(funct, mu = 1.25e-8) {
        for (let index = 0; index < funct.time.length; index++) {
            funct.time[index] = funct.time[index] / mu;
            funct.IICR_k[index] = 1 / funct.IICR_k[index] / (2 * mu);
        }

        return funct;
    }
}

module.exports = Application