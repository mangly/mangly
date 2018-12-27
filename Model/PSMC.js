'use strict'

class PSMC {
    constructor(name, time, IICR_2, theta, rho){
        this.name = name;
        this.time = time;
        this.IICR_2 = IICR_2;
        this.theta = theta;
        this.rho = rho;
    }
}

module.exports = PSMC