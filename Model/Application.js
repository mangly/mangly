'use strict'

const Python_Communicator = require('./Python_Communicator');
const Application_Utilities = require('../Utilities/Application_Utilities');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');


class Application {
    constructor() {
        this.psmc_collection = [];
        this.msmc_collection = [];
    }

    Add_File(path_collection, callback) {

        var psmc_collection = this.psmc_collection;
        var msmc_collection = this.msmc_collection;

        Python_Communicator.get_File_Results(path_collection, 'get_File_Results.py', function (results) {

            for (const element of results.file_collection) {
                if (element.model == 'psmc' && !Application_Utilities.Contain(element.name, psmc_collection)) psmc_collection.push(new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho));

                else if (!Application_Utilities.Contain(element.name, msmc_collection)) msmc_collection.push(new MSMC(element.name, element.time, element.IICR_k));
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
    }

    Scale_Msmc_Function(funct, mu = 1.25e-8) {
        for (let index = 0; index < funct.time.length; index++) {
            funct.time[index] = funct.time[index] / mu;
            funct.IICR_k[index] = 1 / funct.IICR_k[index] / (2 * mu);
        }
    }

    Scale_Functions() {
        for (const element of this.psmc_collection) {
            this.Scale_Psmc_Function(element);
        }

        for (const element of this.msmc_collection) {
            this.Scale_Msmc_Function(element);
        }
    }
}

module.exports = Application