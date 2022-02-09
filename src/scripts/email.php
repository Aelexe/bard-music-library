<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Sends an email using the mail server specified in the config file.
 * 
 * @param string $subject Subject of the email.
 * @param string $body Body of the email. Can include HTML.
 * @param array $from Array containing the name and email of the sender.
 * @param array $to Array containing the name and email of the recipient.
 */
function sendEmail(string $subject, string $body, array $from, array $to)
{
	global $config;
	$emailConfig = $config["email"];

	try {
		// Instantiation and passing `true` enables exceptions
		$mail = new PHPMailer(true);

		//Server settings
		$mail->SMTPDebug = false;
		$mail->isSMTP();
		$mail->Host       = $emailConfig["host"];
		$mail->SMTPAuth   = true;
		$mail->Username   = $emailConfig["username"];
		$mail->Password   = $emailConfig["password"];
		$mail->SMTPSecure = "ssl";
		$mail->Port       = 465;

		$mail->setFrom($from["email"], $from["name"]);
		$mail->addReplyTo($from["email"], $from["name"]);

		// Recipients
		foreach ($to as &$recipient) {
			$mail->addAddress($recipient);
		}

		// Content
		$mail->isHTML(true);
		$mail->Subject = $subject;
		$mail->Body    = $body;

		$mail->send();
	} catch (Exception $e) {
		http_response_code(500);
		echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
	}
}
