<?php
/**
 * Leads dashboard. Shows customer PII, so it is behind HTTP Basic auth and
 * fails closed when no credentials have been configured.
 */
require_once __DIR__ . '/lead-store.php';

header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex, nofollow');      // Never let this be indexed.
header('Referrer-Policy: no-referrer');
header('X-Frame-Options: DENY');

$config = mib_dashboard_config();

if ($config === null) {
    http_response_code(503);
    ?>
    <!DOCTYPE html>
    <html lang="en"><head><meta charset="UTF-8"><title>Leads dashboard — setup required</title>
    <link rel="icon" type="image/png" href="assets/images/favicon-192.png">
    <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
    <style>body{font-family:system-ui,sans-serif;max-width:640px;margin:60px auto;padding:0 20px;line-height:1.6;color:#0f172a}
    code,pre{background:#f1f5f9;border-radius:6px}code{padding:2px 6px}pre{padding:14px;overflow-x:auto;font-size:13px}</style>
    </head><body>
    <h1>Setup required</h1>
    <p>This dashboard is disabled until a password is configured. It will not display any leads until then.</p>
    <p>Create <code>myinsurancebro-private/dashboard-config.php</code> <strong>one level above</strong>
       <code>public_html</code>, containing:</p>
    <pre>&lt;?php
return [
    'user' =&gt; 'admin',
    'hash' =&gt; 'PASTE_HASH_HERE',
];</pre>
    <p>Generate the hash by running this once (Hostinger → Advanced → SSH, or any PHP prompt),
       replacing the example password:</p>
    <pre>php -r "echo password_hash('your-strong-password', PASSWORD_DEFAULT), PHP_EOL;"</pre>
    <p>Never commit that file, and never place it inside <code>public_html</code>.</p>
    </body></html>
    <?php
    exit;
}

// PHP-FPM/CGI does not populate PHP_AUTH_*; recover it from the raw header.
$authUser = isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : '';
$authPass = isset($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : '';

if ($authUser === '') {
    $raw = '';
    foreach (array('HTTP_AUTHORIZATION', 'REDIRECT_HTTP_AUTHORIZATION') as $key) {
        if (!empty($_SERVER[$key])) {
            $raw = $_SERVER[$key];
            break;
        }
    }
    if (stripos($raw, 'basic ') === 0) {
        $decoded = base64_decode(substr($raw, 6), true);
        if ($decoded !== false && strpos($decoded, ':') !== false) {
            list($authUser, $authPass) = explode(':', $decoded, 2);
        }
    }
}

// hash_equals on the username keeps the comparison constant-time; password_verify
// already is. Both must pass, and we always run both to avoid leaking which failed.
$userOk = hash_equals((string) $config['user'], (string) $authUser);
$passOk = password_verify((string) $authPass, (string) $config['hash']);

if (!$userOk || !$passOk) {
    header('WWW-Authenticate: Basic realm="Myinsurancebro leads", charset="UTF-8"');
    http_response_code(401);
    echo 'Authentication required.';
    exit;
}

$leads = mib_read_leads();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Myinsurancebro — Submitted Leads</title>
    <link rel="icon" type="image/png" href="assets/images/favicon-192.png">
    <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px; }
        .container { max-width: 900px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        h1 { font-size: 24px; font-weight: 700; margin: 0; }
        .count-badge { background: #FFEB3C; color: #0f172a; font-weight: 700; padding: 4px 12px; border-radius: 999px; font-size: 14px; }
        .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 16px; padding: 20px; }
        .card-header { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 12px; }
        .name { font-size: 18px; font-weight: 700; color: #0f172a; }
        .time { font-size: 12px; color: #64748b; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
        .field { font-size: 14px; }
        .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; display: block; margin-bottom: 2px; }
        .value { font-weight: 600; color: #0f172a; }
        .value a { color: #2563eb; text-decoration: none; }
        .empty { text-align: center; padding: 60px; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="assets/images/my-insurance-bro-logo.png" alt="Myinsurancebro Logo" style="height: 36px; width: auto;">
                <h1>Form Submissions Dashboard</h1>
            </div>
            <span class="count-badge"><?php echo count($leads); ?> Leads Recorded</span>
        </div>

        <?php if (empty($leads)): ?>
            <div class="card empty">
                <p>No form submissions recorded yet. Try submitting the form on the website!</p>
            </div>
        <?php else: ?>
            <?php foreach ($leads as $lead): ?>
                <div class="card">
                    <div class="card-header">
                        <span class="name"><?php echo htmlspecialchars($lead['name'] ?? 'N/A'); ?></span>
                        <span class="time">🕒 <?php echo htmlspecialchars($lead['timestamp'] ?? ''); ?></span>
                    </div>
                    <div class="grid">
                        <div class="field">
                            <span class="label">Phone / WhatsApp</span>
                            <span class="value"><a href="tel:<?php echo htmlspecialchars($lead['phone'] ?? ''); ?>"><?php echo htmlspecialchars($lead['phone'] ?? 'N/A'); ?></a></span>
                        </div>
                        <div class="field">
                            <span class="label">Email Address</span>
                            <span class="value"><?php echo htmlspecialchars(($lead['email'] ?? '') ?: 'Not provided'); ?></span>
                        </div>
                        <div class="field">
                            <span class="label">Product</span>
                            <span class="value"><?php echo htmlspecialchars($lead['product'] ?? 'General'); ?></span>
                        </div>
                        <div class="field">
                            <span class="label">Preferred Call Time</span>
                            <span class="value"><?php echo htmlspecialchars($lead['preferred_time'] ?? 'N/A'); ?></span>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>
