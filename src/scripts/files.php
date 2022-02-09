<?php

$CONTENT_DIRECTORY = $_SERVER["DOCUMENT_ROOT"] . "/content/";

function saveMusicImage(string $userLink, string $musicLink, $file)
{
	global $CONTENT_DIRECTORY;

	$filePath = $CONTENT_DIRECTORY . $userLink . "/" . $musicLink . "/image." . pathinfo($file["name"], PATHINFO_EXTENSION);
	$directoryPath = dirname($filePath);

	if (!is_dir($directoryPath)) {
		mkdir($directoryPath, 0755, true);
	}

	move_uploaded_file($file['tmp_name'], $filePath);

	return "/content/" . $userLink . "/" . $musicLink . "/image." . pathinfo($file["name"], PATHINFO_EXTENSION);
}

function saveMusicMidi(string $userLink, string $musicLink, $file)
{
	global $CONTENT_DIRECTORY;

	$filePath = $CONTENT_DIRECTORY . $userLink . "/" . $musicLink . "/midis/" . $file["name"] . ".mid";
	$directoryPath = dirname($filePath);

	if (!is_dir($directoryPath)) {
		mkdir($directoryPath, 0755, true);
	}

	move_uploaded_file($file['tmp_name'], $filePath);

	return "/content/" . $userLink . "/" . $musicLink . "/midis/" . $file["name"] . ".mid";
}

function imageExists(string $name, string $extension)
{
	global $IMAGE_DIRECTORY;

	$filePath = $IMAGE_DIRECTORY . $name . "." . $extension;

	return file_exists($filePath);
}

function deleteFile(string $path)
{
	global $CONTENT_DIRECTORY;
	unlink($CONTENT_DIRECTORY . $path);
}
