'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');

class MSMC {
    constructor(name, time, IICR_k, Mu, path){
        this.name = name;
        this.time = time;
        this.IICR_k = IICR_k;
        this.model = 'msmc';
        this.Mu = Mu;
        this.path = path;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.time = this.time.slice();
        clone.IICR_k = this.IICR_k.slice();

        return clone;
    }

    Equals(msmc) {
        return (this.name == msmc.name || (Application_Utilities.Equals(this.time, msmc.time) && Application_Utilities.Equals(this.IICR_k, msmc.IICR_k)));
    }
}

module.exports = MSMC