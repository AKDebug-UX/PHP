<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Mail.php';

$database = new Database();
$db = $database->getConnection();

$mail = new Mail($db);

$data = json_decode(file_get_contents("php://input"));

$mail->id = $data->id;

if($mail->readOne()) {
    $mail->sender = $data->sender;
    $mail->recipient = $data->recipient;
    $mail->subject = $data->subject;
    $mail->status = $data->status;
    $mail->priority = $data->priority;
    $mail->department = $data->department;
    $mail->description = $data->description;
    
    // Update dates based on status
    if($data->status == 'sent' && empty($mail->date_sent)) {
        $mail->date_sent = date('Y-m-d');
    }
    if($data->status == 'received' && empty($mail->date_received)) {
        $mail->date_received = date('Y-m-d');
        if(empty($mail->date_sent)) {
            $mail->date_sent = date('Y-m-d');
        }
    }

    if($mail->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Mail was updated successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update mail."));
    }
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Mail not found."));
}
?>