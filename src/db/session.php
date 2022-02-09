<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";
require_once "db.php";

function insertSession($username, $sessionKey)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("INSERT INTO sessions (user_id, session_key) VALUES ((SELECT id from users WHERE name=?), ?);")->bindParameter("ss", $username, $sessionKey)->execute();

	$db->closeConnection();
}

function selectSession($username, $sessionKey)
{
	global $db;
	$db->openConnection();

	$row = $db->prepareStatement("SELECT users.id, users.name, users.link, sessions.session_key FROM sessions, users WHERE users.id = sessions.user_id AND users.name = ? AND sessions.session_key = ?")->bindParameter("ss", $username, $sessionKey)->getFirst();

	$db->closeConnection();

	return $row;
}

function deleteSession($username, $sessionKey)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("DELETE FROM sessions USING sessions, users WHERE users.id = sessions.user_id AND users.name = ? AND sessions.session_key = ?")->bindParameter("ss", $username, $sessionKey)->execute();

	$db->closeConnection();
}
