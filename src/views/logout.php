<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/views/session.php";
http_response_code(302);
header("Location: /");
terminateSession();
