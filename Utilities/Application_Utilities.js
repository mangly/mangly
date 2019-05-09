'use strict'

class Application_Utilities {

    static Generate_Data_To_Chart(vector_X, vector_Y) {
        var result = [];

        for (let index = 0; index < vector_X.length; index++) {
            result.push({ 'x': vector_X[index], 'y': vector_Y[index] });
        }

        return result;
    }

    static Generate_Inverse_Data_To_Chart(data) {
        var result = {
            x: [],
            y: []
        };

        for (let index = 0; index < data.length; index++) {
            result.x.push(data[index].x);
            result.y.push(data[index].y);
        }

        return result;
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

        return (Math.round(result * 100) / 100).toString() + 'e+' + (count - 1).toString();
    }

    static Get_Model_Selected(path) {
        var array_extensions = path.split('.');
        return array_extensions[array_extensions.length - 1];
    }

    static Get_Model_Name(path) {
        var array_extensions = path.split('.');
        var array_path = array_extensions[0].split('/');
        return array_path[array_path.length - 1];
    }

    // static Divide_Paths(arrPath) {
    //     var psmc_msmc_paths = [];
    //     var nssc_paths = [];

    //     for (const path of arrPath) {
    //         if (this.Get_Model_Selected(path) != 'nssc') psmc_msmc_paths.push(path);
    //         else nssc_paths.push(path);
    //     }

    //     return [psmc_msmc_paths, nssc_paths];
    // }

    static Equals(a_collection, b_collection) {
        if (a_collection.length == b_collection.length) {
            for (let index = 0; index < a_collection.length; index++) {
                if (a_collection[index] != b_collection[index]) return false;
            }

            return true;
        }

        else return false;
    }

    static Valid_Time_Of_Change(previous_value_time, new_value_time, next_value_time) {
        if (new_value_time != '' && new_value_time > 0 && new_value_time <= 100) {
            if (isNaN(next_value_time)) return previous_value_time < new_value_time;
            else return previous_value_time < new_value_time && new_value_time < next_value_time;
        }

        return false;
    }

    static Number_Of_Occurrences(text, char) {
        var count = 0;

        for (const element of text) {
            if (element == char) count++;
        }

        return count;
    }

    static Valid_Euler_Number(number) {
        if (Application_Utilities.Number_Of_Occurrences(number, '.') > 1 || Application_Utilities.Number_Of_Occurrences(number, 'e') > 1 || Application_Utilities.Number_Of_Occurrences(number, '-') > 1) return false;

        var split = number.split('e');

        if (split[1] != '-8') return false;

        return true;
    }

    static Valid_Number(number) {
        if (Application_Utilities.Number_Of_Occurrences(number, '.') > 1) return false;

        var split = number.split('.');
        return !(split[0] == '' || split[1] == '');
    }

    static Valid_NREF(nref) {
        return nref != '' && nref >= 1 && nref <= 10000;
    }

    static Valid_M(m) {
        return m != '' && m >= 1 && m <= 100;
    }

    static Valid_C(c) {
        return c != '' && c >= 1 && c <= 1000;
    }

    static Valid_Sampling_Vector(n) {
        return n != '' && n >= 2 && n <= 1000;
    }

    static Valid_Number_Of_Events(n){
        return n != '' && n >= 1;
    }

    static Valid_Number_Of_Demes(n){
        return n != '' && n >= 2;
    }

    static Allow_Only_Number(evt, type) {
        var charCode = evt.charCode;

        if (type == 'float') {
            if (!((charCode >= 48 && charCode <= 57) || charCode == 46 || charCode == 13)) {
                evt.preventDefault();
            }
        }

        else if (type == 'sn') {
            if (!((charCode >= 48 && charCode <= 57) || charCode == 46 || charCode == 101 || charCode == 45 || charCode == 13)) {
                evt.preventDefault();
            }
        }

        else if(type == 'non_negative'){
            if (!(charCode > 48 && charCode <= 57 || charCode == 13)) {
                evt.preventDefault();
            }
        }

        else {
            if (!(charCode >= 48 && charCode <= 57 || charCode == 13)) {
                evt.preventDefault();
            }
        }
    }

    // static Is_Int_Type(number) {
    //     var position = number.indexOf('.');

    //     if (position >= 0) return false;
    //     return true;
    // }

    static Sum(data) {
        var sum = 0;
        for (let index = 0; index < data.length; index++) {
            const element = parseFloat(data[index]);

            sum += element;
        }

        return sum;
    }

    static Get_Name_Of_Path(path, count) {
        var path_split = path.split('/');
        var new_name = path_split[path_split.length - 1].slice(0, -count);

        return new_name;
    }
}

module.exports = Application_Utilities