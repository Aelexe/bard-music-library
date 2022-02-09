<?php
if ($_SERVER['REQUEST_METHOD'] === "GET") {
	require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";

	$loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/templates");

	$twig = new \Twig\Environment($loader);

	echo ($twig->render("login.twig"));
	exit();
} else if ($_SERVER['REQUEST_METHOD'] === "POST") {
	require_once $_SERVER["DOCUMENT_ROOT"] . "/db/users.php";

	$user = getUserByUsername($_POST["username"]);

	$loginValid = password_verify($_POST["password"], $user["password"]);

	if ($loginValid) {
		require_once $_SERVER["DOCUMENT_ROOT"] . "/views/session.php";
		http_response_code(204);
		createSession($user["name"]);
		exit();
	} else {
		http_response_code(400);
		exit();
	}
}
