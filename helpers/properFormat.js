let is = require("is_js");
/* properFormat will take in a string and trim it, and capitalize the first letter of every word
 * It accounts for numbers/other chars as well, and will leave numbers and all other chars as they are.
 * so can be used for an address -> properFormat('   6600 deLmOniCo DR.   ') will return '6600 Delmonico Dr'
 */
module.exports = function(aString) {
    var newStr = "";
    var atSpace = true;
    aString = aString.trim();
    for (var i = 0; i < aString.length; i++) {
        const ch = aString.charAt(i);
        if (is.space(ch) && !atSpace) {
            atSpace = true;
            newStr += " ";
        }
        else if (atSpace === true) {
            if (is.not.space(ch)) {
                newStr += ch.toUpperCase();
                atSpace = false;
            }
        }
        else {
            newStr += ch.toLowerCase();
        }
    } // end for
    return newStr;
};