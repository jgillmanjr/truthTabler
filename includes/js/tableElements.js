function addSymbol(charCode)
{
	workingChar = String.fromCharCode(charCode);
	$('#addSymbol').remove();
	$('#symbolForm').append('<div class="symbol" data-symbol="' + workingChar + '">' + workingChar + ': <input type="text" class="symbolRep" name="' + workingChar + '" onchange="updateButton(\'' + workingChar + '\');"><a id="addSymbol" href="#" onclick="addSymbol(' + (charCode + 1) + ');">+</a></div>');
	$('#availableSymbols').append('<input type="button" id="symbolButton' + workingChar + '" class="symbolButton" value="' + workingChar +'">');
}

function addProposition(propNumber)
{
	$('#addProposition').remove();
	$('#propositionForm').append('<div class="propLine" data-proposition="' + propNumber + '">Proposition ' + propNumber + ': <input type="text" class="proposition" name="' + propNumber + '"><a id="addProposition" href="#" onclick="addProposition(' + (propNumber + 1) + ');">+</a></div>');
}

function updateButton(character)
{
	$('#symbolButton' + character).attr('title', $('[name="' + character + '"]').val());
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
					analysis = data;
					generateTable(analysis);
				}
		}
	);
}

function generateTable(logicData)
{
	tableColumns = new Array();
	tableData = new Array();

	// Set columns
	var i;
	tableColumns.push(
		{
			sTitle:	'Truthset',
			sClass:	'center'
		}
	);
	for(i = 0; i <= (availableSymbols.length - 1); ++i)
	{
		tableColumns.push(
			{
				sTitle : availableSymbols[i],
				sClass : 'center'
			}
		);
	}
	for(i = 0; i <= (analysis.byProp.length - 1); ++i)
	{
		tableColumns.push(
			{
				sTitle : analysis.byProp[i].proposition,
				sClass : 'center'
			}
		);
	}

	// Set data
	for(i = (Object.keys(analysis.byInt).length - 1); i >= 0; --i) // Counting down, since we want to start with all true
	{
		tableRow = new Array();
		tableRow.push(i); // The truthset (the integer version of the boolean bits)
		var j;
		for(j = 0; j <= (availableSymbols.length - 1); ++j) // Push in the symbols
		{
			if(analysis.byInt[i].truthValues[availableSymbols[j]])
			{
				tableRow.push('T');
			}
			else
			{
				tableRow.push('F');
			}
		}
		for(j = 0; j <= (availableProps.length - 1); ++j) // Push in the proposition evaluations
		{
			if(analysis.byInt[i].propositions[j].propositionValue)
			{
				tableRow.push('T');
			}
			else
			{
				tableRow.push('F');
			}
		}

		tableData.push(tableRow);
	}

	$('#resultTable').dataTable(
		{
			bDestroy:	true, // This will clean out the table first
			bFilter:	false,
			bPaginate:	false,
			aaSorting:	[],
			aoColumns:	tableColumns,
			aaData:		tableData
		}
	);
}