<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";
require_once "db.php";

function getUserByUsername($username)
{
	global $db;
	$db->openConnection();

	$row = $db->prepareStatement("SELECT id, name, email, password FROM users WHERE name = ?")->bindParameter("s", $username)->getFirst();

	$db->closeConnection();

	return $row;
}

function getUserByEmail($email)
{
	global $db;
	$db->openConnection();

	$row = $db->prepareStatement("SELECT id, name, email, password FROM users WHERE email = ?")->bindParameter("s", $email)->getFirst();

	$db->closeConnection();

	return $row;
}

function getUserByUsernameOrEmail($username, $email)
{
	global $db;
	$db->openConnection();

	$row = $db->prepareStatement("SELECT id, name, email, password FROM users WHERE name = ? OR email = ?")->bindParameter("ss", $username, $email)->getFirst();

	$db->closeConnection();

	return $row;
}

function isUserActive($userLink): bool
{
	global $db;
	$db->openConnection();

	$row = $db->prepareStatement("SELECT id FROM users WHERE link = ? AND status_id = (SELECT id FROM user_status WHERE name = 'Active')")->bindParameter("s", $userLink)->getFirst();

	$db->closeConnection();

	return isset($row);
}

function createUser($username, $link, $email, $password)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("INSERT INTO users(name, link, email, password, status_id) VALUES(?, ?, ?, ?, (SELECT id from user_status AS us WHERE us.name = 'Inactive'))")->bindParameter("ssss", $username, $link, $email, $password)->execute();

	$db->closeConnection();
}

function createUserActivationKey($userId, $activationKey)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("INSERT INTO user_activation_keys(user_id, activation_key) VALUES(?, ?)")->bindParameter("is", $userId, $activationKey)->execute();

	$db->closeConnection();
}

function activateUser($userLink, $activationKey)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("UPDATE users AS u INNER JOIN user_activation_keys AS uak ON u.id = uak.user_id SET status_id = (SELECT id FROM user_status AS us WHERE us.name = 'Active') WHERE u.link = ? AND uak.activation_key = ?")->bindParameter("ss", $userLink, $activationKey)->execute();

	$db->closeConnection();
}

function deleteActivationKey($userLink)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("DELETE uak FROM users u, user_activation_keys uak WHERE u.link = ? AND u.id = uak.user_id")->bindParameter("s", $userLink)->execute();

	$db->closeConnection();
}
