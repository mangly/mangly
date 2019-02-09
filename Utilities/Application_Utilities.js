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

    static Remove_Character(str, char_pos) {
        var part1 = str.substring(0, char_pos);
        var part2 = str.substring(char_pos + 1, str.length);
        return (part1 + part2);
    }

    static Convert_Positive_Number_Scientific_Notation(number) {
        if (!number.includes('.')) number += '.00';

        var count = number.indexOf('.');

        var number = this.Remove_Character(number, count);

        var result = parseFloat([number.slice(0, 1), '.', number.slice(1)].join(''));

        return (Math.round(result*100)/100).toString() + 'e+' + (count - 1).toString();
    }
}

module.exports = Application_Utilities