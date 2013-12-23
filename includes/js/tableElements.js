function addSymbol(charCode)
{
	workingChar = String.fromCharCode(charCode);
	$('#addSymbol').remove();
	$('#symbolForm').append('<div class="symbol" data-symbol="' + workingChar + '">' + workingChar + ': <input type="text" class="symbolRep" name="' + workingChar + '"><a id="addSymbol" href="#" onclick="addSymbol(' + (charCode + 1) + ');">+</a></div>');
	$('#availableSymbols').append('<input type="button" class="symbolButton" value="' + workingChar +'">');
}

function addProposition(propNumber)
{
	$('#addProposition').remove();
	$('#propositionForm').append('<div class="propLine" data-proposition="' + propNumber + '">Proposition ' + propNumber + ': <input type="text" class="proposition" name="' + propNumber + '"><a id="addProposition" href="#" onclick="addProposition(' + (propNumber + 1) + ');">+</a></div>');
}