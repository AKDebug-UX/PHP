<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Mail.php';

$database = new Database();
$db = $database->getConnection();

$mail = new Mail($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->sender) &&
    !empty($data->recipient) &&
    !empty($data->subject) &&
    !empty($data->status) &&
    !empty($data->priority) &&
    !empty($data->department) &&
    !empty($data->description)
) {
    $mail->tracking_number = $mail->generateTrackingNumber();
    $mail->sender = $data->sender;
    $mail->recipient = $data->recipient;
    $mail->subject = $data->subject;
    $mail->status = $data->status;
    $mail->priority = $data->priority;
    $mail->department = $data->department;
    $mail->description = $data->description;
    
    // Set dates based on status
    if($data->status == 'sent' || $data->status == 'received') {
        $mail->date_sent = date('Y-m-d');
    }
    if($data->status == 'received') {
        $mail->date_received = date('Y-m-d');
    }

    if($mail->create()) {
        http_response_code(201);
        echo json_encode(array(
            "message" => "Mail was created successfully.",
            "tracking_number" => $mail->tracking_number
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create mail."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create mail. Data is incomplete."));
}
?>