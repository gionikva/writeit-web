// JS Spell Checker
var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://jspell-checker.p.rapidapi.com/check',
  headers: {
    'content-type': 'application/json',
    'x-rapidapi-key': '200cb975d4mshb0f49b8335c651bp1308bfjsnff8c2bac6e91',
    'x-rapidapi-host': 'jspell-checker.p.rapidapi.com'
  },
  data: {
    language: 'enUS',
    fieldvalues: 'thiss is intresting',
    config: {
      forceUpperCase: false,
      ignoreIrregularCaps: false,
      ignoreFirstCaps: true,
      ignoreNumbers: true,
      ignoreUpper: false,
      ignoreDouble: false,
      ignoreWordsWithNumbers: true
    }
  }
};

axios.request(options).then(function (response) {
	var errors = response.data.elements[0].errors

	errors.forEach(error => {
		var suggestions = error.suggestions
		suggestions.forEach(suggest => console.log(suggest))
	})

}).catch(function (error) {
	console.error(error);
});
