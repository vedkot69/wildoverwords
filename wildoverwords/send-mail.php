<?php
header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Collect and sanitize inputs
$name    = trim(strip_tags($_POST['name'] ?? ''));
$email   = trim(strip_tags($_POST['email'] ?? ''));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// Validate required fields
if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Name, email, and message are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

// ---- Configuration ----
$to = 'yuktiagarwal27@gmail.com';

$mailSubject = $subject !== '' ? "WOW Contact: $subject" : "WOW Contact: New message from $name";

$body  = "Name: $name\n";
$body .= "Email: $email\n";
if ($subject !== '') {
    $body .= "Subject: $subject\n";
}
$body .= "\nMessage:\n$message\n";

$headers  = "From: noreply@wildoverwords.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send
$sent = mail($to, $mailSubject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email.']);
}
