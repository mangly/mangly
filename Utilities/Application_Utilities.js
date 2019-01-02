'use strict'

class Application_Utilities {

    static Generate_Data_To_Chart(vector_X, vector_Y) {
        var result = [];

        for (let index = 0; index < vector_X.length; index++) {
            result.push({ 'x': vector_X[index], 'y': vector_Y[index] });
        }

        return result;
    }

    static Convert_Decimal_Scientific_Notation(decimal_number) {
        var temp_number = 0;
        var result = '';

        for (let index = 2; index < decimal_number.length; index++) {
            const element = decimal_number[index];

            if (parseInt(element) != 0) {
                temp_number = decimal_number.substring(index);
                break;
            }
        }

        for (let index = 0; index < temp_number.length; index++) {
            if (index == 1) result += '.' + temp_number[index];
            else result += temp_number[index];
        }


        return parseFloat(result + 'e-' + (decimal_number.length - result.length).toString());
    }
}

module.exports = Application_Utilities