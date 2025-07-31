<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/Mail.php';

$database = new Database();
$db = $database->getConnection();

$mail = new Mail($db);

$tracking_number = isset($_GET['tracking_number']) ? $_GET['tracking_number'] : '';

if(!empty($tracking_number)) {
    $stmt = $mail->searchByTrackingNumber($tracking_number);
    $num = $stmt->rowCount();

    if($num > 0) {
        $mails_arr = array();
        $mails_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $mail_item = array(
                "id" => $id,
                "tracking_number" => $tracking_number,
                "sender" => $sender,
                "recipient" => $recipient,
                "subject" => $subject,
                "status" => $status,
                "priority" => $priority,
                "department" => $department,
                "description" => $description,
                "date_sent" => $date_sent,
                "date_received" => $date_received,
                "created_at" => $created_at,
                "updated_at" => $updated_at
            );

            array_push($mails_arr["records"], $mail_item);
        }

        http_response_code(200);
        echo json_encode($mails_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No mail found with that tracking number."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Tracking number is required."));
}
?>