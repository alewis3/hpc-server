/**
 * capitalizedFormat is similar to properFormat
 * except it does not capitalize each word, only the first word.
 * @param aString
 * @returns {string}
 */
module.exports = function(aString) {
    var newStr = "";
    aString = aString.trim();
    for (var i = 0; i < aString.length; i++) {
        var ch = aString.charAt(i);
        if (i === 0) {
            newStr += ch.toUpperCase();
        }
        // else, make everything else lowercase
        else {
            newStr += ch.toLowerCase();
        }
    } // end for
    return newStr;
};