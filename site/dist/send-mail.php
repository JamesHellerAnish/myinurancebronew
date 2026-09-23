<?php
require_once __DIR__ . '/lead-store.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Same-origin only. This endpoint writes to the lead store, so there is no
// reason for another site to be able to call it; "*" let anyone flood it.
$allowedOrigins = array(
    'https://myinsurancebro.com',
    'https://www.myinsurancebro.com',
);
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
    exit;
}

// Read POST data from form-data or JSON body
$input = $_POST;
if (empty($input)) {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?? [];
}

$name = isset($input['name']) ? trim(filter_var($input['name'], FILTER_SANITIZE_SPECIAL_CHARS)) : '';
$phone = isset($input['phone']) ? trim(filter_var($input['phone'], FILTER_SANITIZE_SPECIAL_CHARS)) : '';
$email = isset($input['email']) ? trim(filter_var($input['email'], FILTER_SANITIZE_EMAIL)) : '';
// Only a valid address may reach the Reply-To header. Sanitising alone would let
// a malformed value through and silently break replies to the lead.
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email = '';
}
$product = isset($input['product']) ? trim(filter_var($input['product'], FILTER_SANITIZE_SPECIAL_CHARS)) : 'General Advice';
$time = isset($input['preferred_time']) ? trim(filter_var($input['preferred_time'], FILTER_SANITIZE_SPECIAL_CHARS)) : 'As soon as possible';
$message = isset($input['message']) ? trim(filter_var($input['message'], FILTER_SANITIZE_SPECIAL_CHARS)) : 'N/A';

if (empty($name) || empty($phone)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Please provide your full name and phone number.'
    ]);
    exit;
}

// 1. SAVE LEAD TO FILE BACKUP (Guarantees no lost leads on Hostinger)
$leadData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'product' => $product,
    'preferred_time' => $time,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown'
];

// Stored outside the web root and written under an exclusive lock, so
// simultaneous submissions cannot overwrite each other. See lead-store.php.
$leadSaved = mib_append_lead($leadData);

// 2. CONSTRUCT EMAIL FOR MYINSURANCEBRO.COM
$to = 'support@myinsurancebro.com';
$fromEmail = 'support@myinsurancebro.com';
$subject = '📞 New Call Booking Request: ' . $name . ' (' . $product . ')';

$body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 20px; background-color: #f1f5f9; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #FFEB3C, #F2C200); padding: 25px; text-align: center; color: #0f172a; }
        .header h2 { margin: 0; font-size: 22px; font-weight: 800; }
        .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 30px; }
        .field-box { margin-bottom: 16px; padding: 12px 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #F2C200; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; color: #64748b; margin-bottom: 4px; display: block; }
        .value { font-size: 16px; font-weight: 600; color: #0f172a; }
        .footer { background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📞 Free Call Booking Request</h2>
            <p>New consultation request submitted from myinsurancebro.com</p>
        </div>
        <div class='content'>
            <div class='field-box'>
                <span class='label'>Full Name</span>
                <span class='value'>" . htmlspecialchars($name) . "</span>
            </div>
            <div class='field-box'>
                <span class='label'>Phone / WhatsApp</span>
                <span class='value'><a href='tel:" . htmlspecialchars($phone) . "' style='color:#0f172a; text-decoration:none;'>" . htmlspecialchars($phone) . "</a></span>
            </div>
            <div class='field-box'>
                <span class='label'>Email Address</span>
                <span class='value'>" . htmlspecialchars($email ?: 'Not provided') . "</span>
            </div>
            <div class='field-box'>
                <span class='label'>Interested Insurance Product</span>
                <span class='value'>" . htmlspecialchars($product) . "</span>
            </div>
            <div class='field-box'>
                <span class='label'>Preferred Callback Time</span>
                <span class='value'>" . htmlspecialchars($time) . "</span>
            </div>
            " . (!empty($message) && $message !== 'N/A' ? "
            <div class='field-box'>
                <span class='label'>Additional Notes</span>
                <span class='value'>" . htmlspecialchars($message) . "</span>
            </div>" : "") . "
        </div>
        <div class='footer'>
            Sent automatically by Myinsurancebro Website Form Processor
        </div>
    </div>
</body>
</html>
";

// 3. HOSTINGER COMPATIBLE HEADERS FOR MYINSURANCEBRO.COM
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';
$headers[] = 'From: Myinsurancebro Advisory <' . $fromEmail . '>';
$headers[] = 'Sender: <' . $fromEmail . '>';
if (!empty($email)) {
    $headers[] = 'Reply-To: ' . $email;
} else {
    $headers[] = 'Reply-To: support@myinsurancebro.com';
}
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send email using PHP mail() with Hostinger envelope sender -f parameter
$mailSent = @mail($to, $subject, $body, implode("\r\n", $headers), "-f " . $fromEmail);

// Only claim success if the lead survived somewhere. If the file write and the
// mail both failed the enquiry is gone, and telling the visitor otherwise means
// they wait for a call that will never come.
if (!$leadSaved && !$mailSent) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Sorry, we could not record your request. Please call or WhatsApp us directly.'
    ]);
    exit;
}

echo json_encode([
    'status' => 'success',
    'message' => 'Thank you! Your call request has been received. Our chief advisor will contact you shortly.',
    'mail_sent' => $mailSent
]);
