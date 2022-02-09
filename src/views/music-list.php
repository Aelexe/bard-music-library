<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";

/* Authentication */
require_once "session.php";
authenticateSession();

/* Database */
require_once $_SERVER["DOCUMENT_ROOT"] . "/db/music.php";
$name = isset($_GET["name"]) ? $_GET["name"] : null;
$ensemble = isset($_GET["ensemble"]) ? $_GET["ensemble"] : null;
$instruments = isset($_GET["instruments"]) ? $_GET["instruments"] : null;
$sort = isset($_GET["sort"]) ? $_GET["sort"] : null;
$direction = isset($_GET["dir"]) ? $_GET["dir"] : null;
$music = getMusic($name, ["ensembles" => $ensemble, "instruments" => $instruments], $sort, $direction);
$musicIds = array_map(function ($value) {
	return $value["id"];
}, $music);

$ensembles = getEnsembles();
$instruments = getInstruments();

/* Render */
$loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/templates");
$twig = new \Twig\Environment($loader);
echo ($twig->render("music-list.twig", ["music" => json_encode($music), "ensembles" => json_encode($ensembles), "instruments" => json_encode($instruments), "username" => getSessionUsername()]));
