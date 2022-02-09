<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";

$loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/templates");
$twig = new \Twig\Environment($loader);

if ($_SERVER['REQUEST_METHOD'] === "GET") {
	echo ($twig->render("register.twig"));
	exit();
} else if ($_SERVER['REQUEST_METHOD'] === "POST") {
	require_once $_SERVER["DOCUMENT_ROOT"] . "/db/users.php";
	require_once $_SERVER["DOCUMENT_ROOT"] . "/scripts/email.php";
	require_once $_SERVER["DOCUMENT_ROOT"] . "/scripts/random.php";

	$username = $_POST["username"];
	$userLink = strtolower($username);
	$email = $_POST["email"];
	$password = $_POST["password"];

	// Validate inputs have been provided.
	if (empty($username) || empty($email) || empty($password)) {
		http_response_code(400);

		$errorElements = [];

		if (empty($username)) {
			array_push($errorElements, "username");
		}
		if (empty($email)) {
			array_push($errorElements, "email");
		}
		if (empty($password)) {
			array_push($errorElements, "password");
		}

		printErrorMessage($errorElements, "must be provided.");

		exit();
	}

	// Validate input constraints.
	$errorMessages = [];

	if (strlen($username) < 3) {
		array_push($errorMessages, "Username must be at least 3 characters long.");
	} else if (preg_match("/\s/", $username)) {
		array_push($errorMessages, "Username must not contain spaces.");
	}

	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		array_push($errorMessages, "Email must be valid.");
	}

	if (strlen($password) < 8) {
		array_push($errorMessages, "Password must be at least 8 characters long.");
	}

	if (count($errorMessages) > 0) {
		http_response_code(400);

		echo (join("\n\r", $errorMessages));

		exit();
	}

	// Get any existing user with the same username or email.
	$existingUser = getUserByUsernameOrEmail($username, $email);

	if (isset($existingUser)) {
		http_response_code(400);

		$errorElements = [];

		if ($existingUser["name"] === $username) {
			array_push($errorElements, "username");
		}
		if ($existingUser["email"] === $email) {
			array_push($errorElements, "email");
		}

		$errorMessage;

		if (count($errorElements) > 1) {
			$errorMessage = "are registered to an existing acount.";
		} else {
			$errorMessage = "is registered to an existing acount.";
		}

		printErrorMessage($errorElements, $errorMessage);

		exit();
	}

	createUser($username, $userLink, $email, password_hash($password, PASSWORD_DEFAULT));
	$user = getUserByUsername($username);
	$activationKey = random_str(20);
	createUserActivationKey($user["id"], $activationKey);

	// Send activation key email.
	sendEmail("Thank you for joining the Bard Music Library", $twig->render("/emails/account-activation.twig", ["username" => $username, "userLink" => $userLink, "activationKey" => $activationKey]), ["email" => "bardmusiclibrary@aelexe.com", "name" => "Bard Music Library"], [$email]);

	// TODO: Fastforward response.
	http_response_code(204);
	exit();
}

function printErrorMessage(array $errorElements, string $message)
{
	$message = " " . $message;
	$errorElements[0] = ucfirst($errorElements[0]);

	$errorMessage = join(", ", $errorElements);

	echo ($errorMessage . $message);
}
