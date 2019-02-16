'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');

class PSMC {
    constructor(name, time, IICR_2, theta, rho, Mu, S) {
        this.name = name;
        this.time = time;
        this.IICR_2 = IICR_2;
        this.theta = theta;
        this.rho = rho;
        this.model = 'psmc';
        this.Mu = Mu;
        this.S = S;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.time = this.time.slice();
        clone.IICR_2 = this.IICR_2.slice();

        return clone;
    }

    Equals(psmc) {
        return (this.name == psmc.name || (Application_Utilities.Equals(this.time, psmc.time) && Application_Utilities.Equals(this.IICR_2, psmc.IICR_2)));
    }
}

module.exports = PSMC