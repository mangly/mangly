'use strict'

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
}

module.exports = PSMC