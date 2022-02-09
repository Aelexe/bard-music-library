<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/db/session.php";

$userCookieName = "username";
$sessionCookieName = "sessionId";

function createSession($username)
{
	global $userCookieName, $sessionCookieName;

	$sessionId = base64_encode(random_bytes(16));

	insertSession($username, $sessionId);

	setcookie($userCookieName, $username);
	setcookie($sessionCookieName, $sessionId);
}

function getSession()
{
	global $userCookieName, $sessionCookieName;

	if (!isset($_COOKIE[$userCookieName]) || !isset($_COOKIE[$sessionCookieName])) {
		return false;
	}

	$session = selectSession($_COOKIE[$userCookieName], $_COOKIE[$sessionCookieName]);

	return $session;
}

function validateSession()
{
	$session = getSession();
	return !empty($session);
}

function authenticateSession()
{
	$sessionIsValid = validateSession();

	if (!$sessionIsValid) {
		if ($_SERVER['REQUEST_URI'] !== "/") {
			header('Location: /login?page=' . $_SERVER['REQUEST_URI']);
		} else {
			header('Location: /login');
		}
		exit();
	}
}

function getSessionUserId()
{
	return getSession()["id"];
}

function getSessionUsername()
{
	return getSession()["name"];
}

function terminateSession()
{
	global $userCookieName, $sessionCookieName;

	deleteSession($_COOKIE[$userCookieName], $_COOKIE[$sessionCookieName]);

	setcookie($userCookieName, null, -1);
	setcookie($sessionCookieName, null, -1);
}
