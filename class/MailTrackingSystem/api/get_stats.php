<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Mail.php';

$database = new Database();
$db = $database->getConnection();

$mail = new Mail($db);

$stats = $mail->getStats();

if($stats) {
    http_response_code(200);
    echo json_encode($stats);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Unable to get statistics."));
}
?>