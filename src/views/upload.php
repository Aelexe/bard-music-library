<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";

/* Authentication */
require_once "session.php";
authenticateSession();

require_once $_SERVER["DOCUMENT_ROOT"] . "/db/music.php";

if ($_SERVER['REQUEST_METHOD'] === "GET") {
	/* Database */
	$ensembles = getEnsembles();
	$instruments = getInstruments();

	/* Render */
	$loader = new \Twig\Loader\FilesystemLoader($_SERVER["DOCUMENT_ROOT"] . "/templates");
	$twig = new \Twig\Environment($loader);
	echo ($twig->render("upload.twig", ["ensembles" => json_encode($ensembles), "instruments" => json_encode($instruments), "username" => getSessionUsername()]));
} else if ($_SERVER['REQUEST_METHOD'] === "POST") {
	require_once $_SERVER["DOCUMENT_ROOT"] . "/scripts/files.php";
	require_once $_SERVER["DOCUMENT_ROOT"] . "/scripts/linkify.php";

	$link = linkify($_POST["title"]);

	/* Database */
	$session = getSession();
	$imagePath = null;
	if (!empty($_FILES["image"])) {
		$imagePath = saveMusicImage($session["link"], $link, $_FILES["image"]);
	}

	createMusic($_POST["title"], $link, $_POST["description"], $session["id"], $imagePath);
	$music = getUserMusic($session["link"], $link);

	if (strlen($_POST["ensembles"]) > 0) {
		addMusicEnsembles($music["id"], explode(",", $_POST["ensembles"]));
	}

	if (strlen($_POST["instruments"]) > 0) {
		addMusicInstruments($music["id"], explode(",", $_POST["instruments"]));
	}

	foreach ($_FILES as $key => $midi) {
		if (strpos($key, "midi") !== false) {
			$midiPath = saveMusicMidi($session["link"], $link, $midi);
			addMusicMidi($music["id"], $midi["name"], $midiPath);
		}
	}

	http_response_code(201);
	header("Location: /user/" . $session["link"] .  "/music/" . $link);
	exit();
}
