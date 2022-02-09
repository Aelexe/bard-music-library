<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";
require_once "db.php";

$musicQuery = "SELECT DISTINCT m.id, m.title, m.link, m.image_path AS imagePath, u.name as author, description, views, likes FROM music m, users u, instruments i, music_instruments mi, music_ensembles me WHERE u.id = m.author_id";

function getMusic($searchName = null, $filters = null, $orderBy = null, $direction = null)
{
	global $db, $musicQuery;
	$db->openConnection();

	$rows = null;

	$statement = $musicQuery;
	$parameterSignatures = "";
	$parameters = [];

	if (isset($searchName)) {
		$statement = $statement . " AND m.title LIKE ?";
		$parameterSignatures = $parameterSignatures . "s";
		array_push($parameters, "%" . $searchName . "%");
	}

	if (isset($filters)) {
		if (isset($filters["ensembles"])) {
			$ensembles = explode(",", $filters["ensembles"]);
			$parameterString = implode(",", array_fill(0, count($ensembles), "?"));
			$statement = $statement . " AND m.id = me.music_id AND me.ensemble_id IN (" . $parameterString . ")";
			$parameterSignatures = $parameterSignatures . str_repeat("i", count($ensembles));
			array_push($parameters, ...$ensembles);
		}
		if (isset($filters["instruments"])) {
			$instruments = explode(",", $filters["instruments"]);
			$parameterString = implode(",", array_fill(0, count($instruments), "?"));
			$statement = $statement . " AND m.id = mi.music_id AND mi.instrument_id IN (" . $parameterString . ")";
			$parameterSignatures = $parameterSignatures . str_repeat("i", count($instruments));
			array_push($parameters, ...$instruments);
		}
	}

	if (isset($orderBy)) {
		// Prevent sorting on unpermitted columns.
		if ($orderBy !== "views" && $orderBy !== "likes") {
			$orderBy = "";
		}
		if ($direction !== "asc" && $direction !== "desc") {
			$direction = "desc";
		}

		$statement = $statement . " ORDER BY " . $orderBy . " " . $direction;
	}

	$preparedStatement = $db->prepareStatement($statement);
	if (count($parameters) > 0) {
		$preparedStatement->bindParameter($parameterSignatures, ...$parameters);
	}

	$rows = $preparedStatement->getAll();

	foreach ($rows as &$row) {
		$row["ensembles"] = getMusicEnsembles($row["id"]);
		$row["instruments"] = getMusicInstruments($row["id"]);
		$row["tags"] = getMusicTags($row["id"]);
	}

	$db->closeConnection();

	return $rows;
}

function getEnsembles()
{
	global $db;
	$db->openConnection();

	$rows = $db->prepareStatement("SELECT id, name FROM ensembles")->getAll();

	$db->closeConnection();

	return $rows;
}

function getInstruments()
{
	global $db;
	$db->openConnection();

	$rows = $db->prepareStatement("SELECT i.id, i.name, it.name AS instrumentGroup FROM instruments i INNER JOIN instrument_types it ON i.type_id = it.id")->getAll();

	$db->closeConnection();

	return $rows;
}

function searchMusicByName($searchName)
{
	return getMusic($searchName);
}

function getUserMusic($userLink, $musicLink)
{
	global $db, $musicQuery;
	$db->openConnection();

	$row = $db->prepareStatement($musicQuery . " AND m.link = ? AND u.link = ? AND m.author_id = u.id")->bindParameter("ss", $musicLink, $userLink)->getFirst();
	$row["ensembles"] = getMusicEnsembles($row["id"]);
	$row["instruments"] = getMusicInstruments($row["id"]);
	$row["tags"] = getMusicTags($row["id"]);
	$row["midis"] = getMusicMidis($row["id"]);

	$db->closeConnection();

	return $row;
}

function getMusicInstruments($musicId)
{
	global $db;
	$db->openConnection();

	$rows = $db->prepareStatement("SELECT i.name FROM music_instruments AS mi, instruments AS i WHERE mi.music_id = ? AND mi.instrument_id = i.id")->bindParameter("s", $musicId)->getAll();

	return $rows;
}

function getMusicEnsembles($musicId)
{
	global $db;
	$db->openConnection();

	$rows = $db->prepareStatement("SELECT e.name FROM music_ensembles AS me, ensembles AS e WHERE me.music_id = ? AND me.ensemble_id = e.id")->bindParameter("s", $musicId)->getAll();

	return $rows;
}

function getMusicTags($musicId)
{
	global $db;
	$db->openConnection();

	$rows = $db->prepareStatement("SELECT t.name, t.link FROM music_tags AS mt, tags AS t WHERE mt.music_id = ? AND mt.tag_id = t.id")->bindParameter("s", $musicId)->getAll();

	return $rows;
}

function getMusicStats($musicId)
{
	global $db;
	$db->openConnection();

	$views = $db->prepareStatement("SELECT COUNT(*) FROM music_views AS mv where mv.music_id = m.id AND mv.viewed = 1")->bindParameter("s", $musicId)->getFirst();
	$likes = $db->prepareStatement("SELECT COUNT(*) FROM music_views AS mv where mv.music_id = m.id AND mv.liked = 1")->bindParameter("s", $musicId)->getFirst();

	return [$views[0], $likes[0]];
}

function getMusicMidis($musicId)
{
	global $db;
	$db->openConnection();

	$rows = $db->prepareStatement("SELECT m.title, m.file_path as filePath FROM midis AS m where m.music_id = ?")->bindParameter("s", $musicId)->getAll();

	return $rows;
}

function createMusic(string $title, string $link, string $description, int $authorId, string $imagePath = null)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("INSERT INTO music(title, link, description, author_id, image_path) VALUES(?, ?, ?, ?, ?)")->bindParameter("sssis", $title, $link, $description, $authorId, $imagePath)->execute();

	$db->closeConnection();
}

function addMusicEnsembles(int $musicId, array $ensembleIds)
{
	global $db;
	$db->openConnection();

	$parameterTemplates = [];
	$parameterSignatures = "";
	$parameters = [];

	foreach ($ensembleIds as &$ensembleId) {
		array_push($parameterTemplates, "(?, ?)");
		$parameterSignatures .= "ii";
		array_push($parameters, $musicId, $ensembleId);
	}

	$db->prepareStatement("INSERT INTO music_ensembles(music_id, ensemble_id) VALUES" . implode(",", $parameterTemplates))->bindParameter($parameterSignatures, ...$parameters)->execute();

	$db->closeConnection();
}

function addMusicInstruments(int $musicId, array $instrumentIds)
{
	global $db;
	$db->openConnection();

	$parameterTemplates = [];
	$parameterSignatures = "";
	$parameters = [];

	foreach ($instrumentIds as &$instrumentId) {
		array_push($parameterTemplates, "(?, ?)");
		$parameterSignatures .= "ii";
		array_push($parameters, $musicId, $instrumentId);
	}

	$db->prepareStatement("INSERT INTO music_instruments(music_id, instrument_id) VALUES" . implode(",", $parameterTemplates))->bindParameter($parameterSignatures, ...$parameters)->execute();

	$db->closeConnection();
}

function addMusicMidi(int $musicId, string $midiTitle, string $midiPath)
{
	global $db;
	$db->openConnection();

	$db->prepareStatement("INSERT INTO midis(music_id, title, file_path) VALUES(?, ?, ?)")->bindParameter("iss", $musicId, $midiTitle, $midiPath)->execute();

	$db->closeConnection();
}
