<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/db/users.php";

// Attempt to activate the user using the provided key.
activateUser($_GET["user"], $_GET["key"]);

// If the user is now active, delete any existing keys.
if (isUserActive($_GET["user"])) {
	deleteActivationKey($_GET["user"]);
}

header('Location: /');
