'use strict'

class NSSC {
    constructor(name, x_vector, IICR_specie, scenario) {
        this.name = name;
        this.x_vector = x_vector;
        this.IICR_specie = IICR_specie;
        this.scenario = scenario
        this.model = 'nssc';
    }

    // Clone() {
    //     var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    //     clone.time = this.time.slice();
    //     clone.IICR_k = this.IICR_k.slice();

    //     return clone;
    // }
}

module.exports = NSSC