<?php
declare(strict_types=1);

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/middleware/Security.php';

use NHS\Config\Database;
use NHS\Middleware\Security;

Security::applyHardenedHeaders();

$action = $_GET['action'] ?? '';
$db     = Database::getConnection();
$raw    = file_get_contents('php://input');
$body   = $raw ? (json_decode($raw, true) ?? []) : [];

// 1. Auto-Logout Beacon when User Closes Browser Tab / Window
if ($action === 'beacon_logout' || $action === 'logout') {
    $token = $body['sessionToken'] ?? ($_POST['sessionToken'] ?? '');
    if ($token !== '') {
        $hash = hash('sha256', $token);
        $stmt = $db->prepare("UPDATE user_sessions SET is_active = 0 WHERE session_token_hash = :h");
        $stmt->execute([':h' => $hash]);
    }
    echo json_encode(['ok' => true, 'message' => 'Session terminated on tab/browser close.']);
    exit;
}

// 2. Login with Single-Device Concurrent Session Lock
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = Security::sanitizeString($body['username'] ?? '');
    $password = (string)($body['password'] ?? '');
    $role     = Security::sanitizeString($body['role'] ?? '');
    $deviceFp = Security::sanitizeString($body['deviceFingerprint'] ?? '');
    $ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    if (!Security::checkRateLimit($db, $username) || !Security::checkRateLimit($db, $ip)) {
        http_response_code(429);
        echo json_encode([
            'ok'    => false,
            'error' => 'Too many failed login attempts. Account locked for 15 minutes (Penetration Defense).',
        ]);
        exit;
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE (username = :u OR sector_code = :s) AND role = :r LIMIT 1");
    $stmt->execute([':u' => $username, ':s' => $username, ':r' => $role]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        Security::recordAttempt($db, $username, false);
        Security::recordAttempt($db, $ip, false);
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Invalid credentials or role selection.']);
        exit;
    }

    if ((int)$user['is_active'] !== 1) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Account is currently set to Non-Active by Admin.']);
        exit;
    }

    // Check if user is already logged in on another active device/session
    $sessStmt = $db->prepare("
        SELECT id, device_fingerprint, ip_address, last_heartbeat_at
        FROM user_sessions
        WHERE user_id = :uid
          AND is_active = 1
          AND expires_at > NOW()
        LIMIT 1
    ");
    $sessStmt->execute([':uid' => $user['id']]);
    $existingSession = $sessStmt->fetch();

    if ($existingSession && $existingSession['device_fingerprint'] !== $deviceFp) {
        http_response_code(409);
        echo json_encode([
            'ok'                => false,
            'code'              => 'ALREADY_LOGGED_IN_OTHER_DEVICE',
            'error'             => 'This account is already signed in on another device or browser session. Login blocked.',
            'activeDeviceIp'    => $existingSession['ip_address'],
            'lastHeartbeatTime' => $existingSession['last_heartbeat_at'],
        ]);
        exit;
    }

    Security::recordAttempt($db, $username, true);
    $rawToken  = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $rawToken);

    $ins = $db->prepare("
        INSERT INTO user_sessions (user_id, session_token_hash, device_fingerprint, ip_address, user_agent, is_active, expires_at)
        VALUES (:uid, :th, :fp, :ip, :ua, 1, (NOW() + INTERVAL 8 HOUR))
    ");
    $ins->execute([
        ':uid' => $user['id'],
        ':th'  => $tokenHash,
        ':fp'  => $deviceFp,
        ':ip'  => $ip,
        ':ua'  => substr($_SERVER['HTTP_USER_AGENT'] ?? 'Browser', 0, 250),
    ]);

    echo json_encode([
        'ok'           => true,
        'sessionToken' => $rawToken,
        'user'         => [
            'id'          => (int)$user['id'],
            'sectorCode'  => $user['sector_code'],
            'username'    => $user['username'],
            'fullName'    => $user['full_name'],
            'email'       => $user['email'],
            'role'        => $user['role'],
            'memberType'  => $user['member_type'],
            'avatarUrl'   => $user['avatar_url'],
        ],
    ]);
    exit;
}

// 3. Trainee Self-Registration ("I want to be a trainee")
if ($action === 'register_trainee' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = Security::sanitizeString($body['fullName'] ?? '');
    $username = Security::sanitizeString($body['username'] ?? '');
    $email    = Security::sanitizeString($body['email'] ?? '');
    $password = (string)($body['password'] ?? '');
    $groupId  = (int)($body['primaryGroupId'] ?? 1);

    if ($fullName === '' || $username === '' || strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Full name, username, and a 6+ character password are required.']);
        exit;
    }

    $sectorCode = 'TRN-' . date('Y') . '-' . random_int(100, 999);
    $hash       = password_hash($password, PASSWORD_ARGON2ID);

    $stmt = $db->prepare("
        INSERT INTO users (sector_code, username, full_name, email, password_hash, role, member_type, primary_group_id, is_active)
        VALUES (:sc, :u, :fn, :em, :ph, 'trainee', 'none', :gid, 1)
    ");
    $stmt->execute([
        ':sc'  => $sectorCode,
        ':u'   => $username,
        ':fn'  => $fullName,
        ':em'  => $email,
        ':ph'  => $hash,
        ':gid' => $groupId,
    ]);

    $newUserId = (int)$db->lastInsertId();
    $db->prepare("INSERT IGNORE INTO user_settings (user_id) VALUES (:uid)")->execute([':uid' => $newUserId]);

    echo json_encode([
        'ok'         => true,
        'sectorCode' => $sectorCode,
        'userId'     => $newUserId,
        'message'    => 'Trainee account created!',
    ]);
    exit;
}

http_response_code(404);
echo json_encode(['ok' => false, 'error' => 'Unknown auth action']);
