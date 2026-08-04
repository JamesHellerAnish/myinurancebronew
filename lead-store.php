<?php
/**
 * Shared lead storage for send-mail.php and view-leads.php.
 *
 * Leads are customer PII (name, phone, email). The store therefore lives OUTSIDE
 * the web root, so that no URL maps to it. If the host refuses to let us write
 * above the web root we fall back into public_html, and .htaccess denies direct
 * requests for leads.json to cover that case.
 */

/** Private directory next to the web root, or null if we cannot use it. */
function mib_private_dir()
{
    $dir = dirname(__DIR__) . '/myinsurancebro-private';

    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    return (is_dir($dir) && is_writable($dir)) ? $dir : null;
}

/** Absolute path of the lead file, migrating any legacy in-webroot file once. */
function mib_leads_file()
{
    $private = mib_private_dir();
    $legacy  = __DIR__ . '/leads.json';

    if ($private === null) {
        return $legacy; // Denied by .htaccess.
    }

    $target = $private . '/leads.json';

    // A site deployed before this change has leads sitting in the web root.
    // Move them up rather than stranding them at a URL anyone can fetch.
    if (file_exists($legacy) && !file_exists($target)) {
        if (!@rename($legacy, $target)) {
            // Copy-then-unlink for hosts where rename across paths fails.
            if (@copy($legacy, $target)) {
                @unlink($legacy);
            } else {
                return $legacy;
            }
        }
    }

    return $target;
}

/** All stored leads, newest first. Returns [] when there are none. */
function mib_read_leads()
{
    $file = mib_leads_file();

    if (!file_exists($file)) {
        return array();
    }

    $raw   = file_get_contents($file);
    $leads = json_decode($raw, true);

    return is_array($leads) ? $leads : array();
}

/**
 * Append a lead under an exclusive lock.
 *
 * The previous read-then-write pair had no locking, so two submissions landing
 * together would each read the same array and the second write would drop the
 * first lead. Returns true when the lead is safely on disk.
 */
function mib_append_lead(array $lead)
{
    $file = mib_leads_file();

    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return false;
    }

    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return false;
    }

    $raw   = stream_get_contents($fh);
    $leads = json_decode($raw, true);
    if (!is_array($leads)) {
        $leads = array();
    }

    array_unshift($leads, $lead);

    rewind($fh);
    ftruncate($fh, 0);
    $ok = fwrite($fh, json_encode($leads, JSON_PRETTY_PRINT)) !== false;

    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    @chmod($file, 0600);

    return $ok;
}

/**
 * Credentials for the leads dashboard, or null when not configured.
 *
 * Deliberately fail-closed: with no config file the dashboard refuses to render
 * rather than falling back to a default password.
 */
function mib_dashboard_config()
{
    $private = mib_private_dir();
    if ($private === null) {
        return null;
    }

    $file = $private . '/dashboard-config.php';
    if (!file_exists($file)) {
        return null;
    }

    // This file is created by hand on the server, so it very easily picks up a
    // UTF-8 BOM or a trailing newline outside the PHP tags. That counts as output:
    // headers are then already sent, the 401 and WWW-Authenticate never reach the
    // client (so no login prompt appears) and PHP prints a warning exposing the
    // absolute server path. Swallow anything the include emits.
    ob_start();
    $cfg = include $file;
    ob_end_clean();

    if (!is_array($cfg) || empty($cfg['user']) || empty($cfg['hash'])) {
        return null;
    }

    return $cfg;
}
