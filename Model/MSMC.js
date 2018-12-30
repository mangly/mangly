'use strict'

class MSMC {
    constructor(name, time, IICR_k){
        this.name = name;
        this.time = time;
        this.IICR_k = IICR_k;
        this.model = 'msmc';
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.time = this.time.slice();
        clone.IICR_k = this.IICR_k.slice();

        return clone;
    }
}

module.exports = MSMC