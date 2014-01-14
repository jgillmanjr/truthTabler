function addSymbol(charCode)
{
	workingChar	=	String.fromCharCode(charCode); // The next character
	$('#symbolAdder').remove();
	$('#symbolRemover').remove();
	$('#symbolForm').append('<div class="symbol" data-symbol="' + workingChar + '">' + workingChar + ': <input type="text" class="symbolRep" name="' + workingChar + '" onchange="updateButton(\'' + workingChar + '\');"><input type="button" id="symbolAdder" value="+" onclick="addSymbol(' + (charCode + 1) + ');"><input type="button" id="symbolRemover" value="-" onclick="remSymbol(' + (charCode) + ');"></div>');
}

function remSymbol(charCode)
{
	workingChar =	String.fromCharCode(charCode); // The current character
	prevChar	=	String.fromCharCode(charCode - 1);
	$('[data-symbol=' + workingChar + ']').remove();
	$('[data-symbol=' + prevChar + ']').append('<input type="button" id="symbolAdder" value="+" onclick="addSymbol(' + (charCode) + ');"><input type="button" id="symbolRemover" value="-" onclick="remSymbol(' + (charCode - 1) + ');">');
}

function addProposition(propNumber)
{
	// The next proposition
	$('#propAdder').remove();
	$('#propRemover').remove();
	$('#propositionForm').append('<div class="propLine" data-proposition="' + propNumber + '">Proposition ' + propNumber + ': <input type="text" class="proposition" name="' + propNumber + '"><input type="button" id="propAdder" value="+" onclick="addProposition(' + (propNumber + 1) + ');"><input type="button" id="propRemover" value="-" onclick="remProposition(' + (propNumber) + ');"></div>');
}

function remProposition(propNumber)
{
	// propNumber is the current proposition that is being removed
	$('[data-proposition=' + propNumber + ']').remove();
	$('[data-proposition=' + (propNumber - 1) + ']').append('<input type="button" id="propAdder" value="+" onclick="addProposition(' + (propNumber) + ');"><input type="button" id="propRemover" value="-" onclick="remProposition(' + (propNumber - 1) + ');">');
}

function getSymbols()
{
	availableSymbols = new Array();
	$('.symbolRep').each(function(index)
		{
			availableSymbols.push($(this).attr('name'));
		}
	)
}

function getProps()
{
	availableProps = new Array();
	$('.proposition').each(function(index)
		{
			availableProps.push($(this).val());
		}
	)
}

function analyze()
{
	propositionData = new Object();
	
	getSymbols();
	getProps();

	propositionData.symbols	= availableSymbols;
	propositionData.propositions = availableProps;

	$.ajax('analyze.php',
		{
			type:	'POST',
			dataType:	'json',
			data:
				{
					propData:	JSON.stringify(propositionData)
				},
			success:
				function(data, textStatus, jqXHR)
				{
					logicData = data;
					generateTable(logicData);
				}
		}
	);
}

function generateTable(analysis)
{
	// Set columns
	$('#resultTable').empty(); // Cleanout the table if it already exists
	tableHtml = '<tr>' + "\n" + '<th>Truthset</th>' + "\n";
	var i;
	for(i = 0; i <= (availableSymbols.length - 1); ++i)
	{
		tableHtml += '<th>' + availableSymbols[i] + '</th>' + "\n";
	}
	for(i = 0; i <= (analysis.byProp.length - 1); ++i)
	{
		tableHtml += '<th>' + analysis.byProp[i].proposition + '</th>' + "\n";
	}
	tableHtml += '</tr>' + "\n";

	// Set data
	for(i = (Object.keys(analysis.byInt).length - 1); i >= 0; --i) // Counting down, since we want to start with all true
	{
		tableHtml += '<tr>' + "\n" + '<td>' + i + '</td>' + "\n";
		var j;
		for(j = 0; j <= (availableSymbols.length - 1); ++j) // Push in the symbols
		{
			if(analysis.byInt[i].truthValues[availableSymbols[j]])
			{
				tableHtml += '<td>T</td>' + "\n";
			}
			else
			{
				tableHtml += '<td>F</td>' + "\n";
			}
		}
		for(j = 0; j <= (availableProps.length - 1); ++j) // Push in the proposition evaluations
		{
			if(analysis.byInt[i].propositions[j].propositionValue)
			{
				tableHtml += '<td>T</td>' + "\n";
			}
			else
			{
				tableHtml += '<td>F</td>' + "\n";
			}
		}
		tableHtml += '</tr>' + "\n";
	}

	$('#resultTable').html(tableHtml);
	delete tableHtml; // cleanup
}