'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');

class MSMC {
    constructor(name, x_vector, y_vector, Mu, path){
        this.name = name;
        this.x_vector = x_vector;
        this.y_vector = y_vector;
        this.model = 'msmc';
        this.Mu = Mu;
        this.path = path;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.x_vector = this.x_vector.slice();
        clone.y_vector = this.y_vector.slice();

        return clone;
    }

    Equals(msmc) {
        return (this.name == msmc.name || (Application_Utilities.Equals(this.x_vector, msmc.x_vector) && Application_Utilities.Equals(this.y_vector, msmc.y_vector)));
    }
}

module.exports = MSMC