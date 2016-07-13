;(function(){
	
/**
	Functions that extend the default JavaScript library.
	
	NOTE: This *may* be a bad idea (at least on older browsers).
	Reference: http://perfectionkills.com/whats-wrong-with-extending-the-dom/
*/

// Lets you remove elements by doing:
//   document.getElementById("my-element").remove();
//   document.getElementsByClassName("my-elements").remove();
// Source: http://stackoverflow.com/a/18120786
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = 
HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// Convert an object in to an HTTP query string (i.e. GET and POST)
//   i.e. serialize({"data":10,"name":"bort"}) --> data=10&name=bort
// Source: http://stackoverflow.com/a/1714899
window.serialize = function(obj, prefix) {
	var str = [];
	for(var p in obj) {
		if (obj.hasOwnProperty(p)) {
			var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
			str.push(typeof v == "object" ?
			window.serialize(v, k) :
			encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
	}
	return str.join("&");
}

// Change " and ' characters in a string for use in Attributes (title, etc)
// http://stackoverflow.com/a/12562097
window.escapeAttribute = function(value) {
	return String(value).
        replace(/\\/g, '\\\\').			/* This MUST be the 1st replacement. */
        replace(/\t/g, '\\t').			/* These 2 replacements protect whitespaces. */
        replace(/\n/g, '\\n').
        replace(/\u00A0/g, '\\u00A0').	/* Useful but not absolutely necessary. */
		replace(/&/g, '&amp;').
		replace(/"/g, '&quot;').		//" // <- kill the weird quoting
		replace(/'/g, '&#39;').			//' // <- kill the weird quoting
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}
// Variation that correctly encodes the apostrophy for Google
window.escapeAttributeGoogle = function(value) {
	return String(value).
        replace(/\\/g, '\\\\').			/* This MUST be the 1st replacement. */
        replace(/\t/g, '\\t').			/* These 2 replacements protect whitespaces. */
        replace(/\n/g, '\\n').
        replace(/\u00A0/g, '\\u00A0').	/* Useful but not absolutely necessary. */
		replace(/&/g, '&amp;').
		replace(/"/g, '&quot;').		//" // <- kill the weird quoting
		replace(/'/g, '%27').			//' // <- kill the weird quoting
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}


window.escapeString = function(value) {
	return String(value).
		replace(/&/g, '&amp;').
		replace(/"/g, '&quot;').		//" // <- kill the weird quoting
		replace(/'/g, '&#39;').			//' // <- kill the weird quoting
		replace(/</g, '&lt;').
		replace(/>/g, '&gt;');
}

// http://stackoverflow.com/a/2901298
window.addCommas = function(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


window.time_CallNextSecond = function( Func ) {
	var Step = 1000;
	var When = Step - (Date.now() % Step);
	//console.log("S"+When);
	setTimeout(Func,When+100);
}
window.time_CallNextMinute = function( Func ) {
	var Step = 60*1000;
	var When = Step - (Date.now() % Step);
	//console.log("M"+When);
	setTimeout(Func,When+1100);
}


})();
