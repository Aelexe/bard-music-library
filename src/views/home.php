<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";

/* Authentication */
require_once "session.php";
$session = getSession();
$username = !empty($session) ? $session["name"] : null;

$loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/templates");
$twig = new \Twig\Environment($loader);
echo ($twig->render("home.twig", ["username" => $username]));
