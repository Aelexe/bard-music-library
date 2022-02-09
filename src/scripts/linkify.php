<?php

/**
 * Returns the provided string as a string suitable for use in URLs, with all non alphanumeric and hyphen characters removed.
 * @param string $text The string to linkify.
 * @return string The converted string.
 */
function linkify(string $text)
{
	$link = strtolower($text);
	$link = preg_replace("/\s+/", "-", $link);
	$link = preg_replace("/\-{2,}/", "-", $link);
	$link = preg_replace("/[^a-zA-Z0-9\-]/", "", $link);

	return $link;
}
