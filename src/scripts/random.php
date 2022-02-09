<?php

/**
 * Generates a pseudorandom string.
 * @param int $length Length of the string to generate.
 * @param string $keyspace String containing characters for use in the string.
 * @return string The generated pseudorandom string.
 */
function random_str(
	int $length = 64,
	string $keyspace = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
): string {
	// Prevent generation of an empty string.
	if ($length < 1) {
		throw new RangeException("Length must be a positive integer");
	}

	// Generate an array of characters using random_int and then return it as a string.
	$pieces = [];
	$max = mb_strlen($keyspace, '8bit') - 1;
	for ($i = 0; $i < $length; ++$i) {
		$pieces[] = $keyspace[random_int(0, $max)];
	}
	return implode('', $pieces);
}
