<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";

$db = new class($config)
{
	private $config;
	private $connection;
	private $statement;

	function __construct($config)
	{
		$this->config = $config;
	}

	public function openConnection()
	{
		$dbConfig = $this->config["db"];
		mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
		$this->connection = new mysqli($dbConfig["servername"], $dbConfig["username"], $dbConfig["password"], $dbConfig["dbname"]);
	}

	public function closeConnection()
	{
		$this->connection->close();
	}

	public function &prepareStatement($statement)
	{
		$this->statement = $this->connection->prepare($statement);
		return $this;
	}

	public function &bindParameter($parameterTypes, ...$parameter)
	{
		$this->statement->bind_param($parameterTypes, ...$parameter);
		return $this;
	}

	public function execute()
	{
		$this->statement->execute();
	}

	public function getFirst()
	{
		$this->statement->execute();
		$results = $this->statement->get_result();
		$row = $results->fetch_assoc();
		$results->close();

		return $row;
	}

	public function getAll()
	{
		$this->statement->execute();
		$results = $this->statement->get_result();
		$rows = array();
		while ($row = $results->fetch_assoc()) {
			array_push($rows, $row);
		}
		$results->close();

		return $rows;
	}
};
