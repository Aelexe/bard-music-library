<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";

/* Authentication */
require_once "session.php";
authenticateSession();

if (!isset($_GET["user"])  || !isset($_GET["music"])) {
	// TODO: Error
}

/* Database */
require_once $_SERVER["DOCUMENT_ROOT"] . "/db/music.php";
$music = getUserMusic($_GET["user"], $_GET["music"]);

/* Render */
$loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/templates");
$twig = new \Twig\Environment($loader);
echo ($twig->render("music.twig", ["music" => json_encode($music), "username" => getSessionUsername()]));
