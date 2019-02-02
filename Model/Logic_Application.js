'use strict'

const Python_Communicator = require('../Utilities/Python_Communicator');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');
const NSSC = require('./NSSC');

class Application {
    constructor() {
        this.psmc_msmc_collection = [];
        this.nssc_collection = [];
        this.Mu = 1.25e-8;
        this.S = 100;
    }

    Contain(element_name) {
        for (let index = 0; index < this.psmc_msmc_collection.length; index++) {
            const element = this.psmc_msmc_collection[index];

            if (element.name == element_name) return element;
        }

        return null;
    }

    Add_File(path_collection, callback) {
        Python_Communicator.get_File_Results(path_collection, 'Python_Scripts/get_File_Results.py', (results) => {

            for (const element of results.file_collection) {
                if (this.Contain(element.name) == null) {
                    if (element.model == 'psmc') {
                        var psmc = new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho, this.Mu, this.S);
                        this.psmc_msmc_collection.push(psmc);
                    }

                    else {
                        var msmc = new MSMC(element.name, element.time, element.IICR_k, this.Mu);
                        this.psmc_msmc_collection.push(msmc);
                    }
                }
            }

            callback();
        })
    }

    Get_NSSC_Vectors(json, callback) {
        Python_Communicator.get_Model_NSSC(json, 'Python_Scripts/get_Model_NSSC.py', (results) => {
            console.log(results)
            var nssc = new NSSC(results.name, results.x_vector, results.IICR_specie);
            this.nssc_collection.push(nssc);
            // console.log(this.nssc_collection);

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

        return funct;
    }

    Scale_Msmc_Function(funct, mu = this.Mu) {
        for (let index = 0; index < funct.time.length; index++) {
            funct.time[index] = funct.time[index] / mu;
            funct.IICR_k[index] = 1 / funct.IICR_k[index] / (2 * mu);
            funct.Mu = mu;
        }

        return funct;
    }
}

module.exports = Application