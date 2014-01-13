<?php
	require('vendor/autoload.php');

	$data = json_decode($_POST['propData'], TRUE);

	$symbols = $data['symbols'];
	$propositions = $data['propositions'];

	$parser = new propLogic($symbols, $propositions);

	echo json_encode($parser->parseArgument());
?>