'use strict'

class Abstract_Model {
    constructor(name, x_vector, y_vector, path) {
        if (new.target === Abstract_Model) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.name = name;
        this.x_vector = x_vector;
        this.y_vector = y_vector;
        this.path = path;
    }

    Clone() {
        throw new Error('You must implement this method');
    }

    Equals() {
        throw new Error('You must implement this method');
    }
}

module.exports = Abstract_Model