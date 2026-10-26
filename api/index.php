<?php
declare(strict_types=1);

require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/middleware/Security.php';

use NHS\Config\Database;
use NHS\Middleware\Security;

Security::applyHardenedHeaders();

$db       = Database::getConnection();
$resource = $_GET['resource'] ?? 'summary';
$method   = $_SERVER['REQUEST_METHOD'];
$raw      = file_get_contents('php://input');
$body     = $raw ? (json_decode($raw, true) ?? []) : [];

if ($resource === 'projects' && $method === 'POST') {
    // Default Priority = 'None', Default Status = 'Draft' on the day created unless set
    $name        = Security::sanitizeString($body['projectName'] ?? '');
    $desc        = Security::sanitizeString($body['description'] ?? '');
    $priority    = $body['priority'] ?? 'None';
    $status      = $body['status']   ?? 'Draft';
    $teamId      = !empty($body['assignedTeamId']) ? (int)$body['assignedTeamId'] : null;
    $dlStart     = !empty($body['deadlineStart'])  ? $body['deadlineStart'] : null;
    $dlEnd       = !empty($body['deadlineEnd'])    ? $body['deadlineEnd']   : null;
    $creatorId   = (int)($body['createdByUserId'] ?? 1);
    $creatorName = Security::sanitizeString($body['createdByLabel'] ?? "Admin's Account");

    $stmt = $db->prepare("
        INSERT INTO projects (project_name, description, status, priority, assigned_team_id, deadline_start, deadline_end, created_by_user_id, created_by_label)
        VALUES (:n, :d, :s, :p, :tid, :ds, :de, :cid, :cl)
    ");
    $stmt->execute([
        ':n'   => $name,
        ':d'   => $desc,
        ':s'   => $status,
        ':p'   => $priority,
        ':tid' => $teamId,
        ':ds'  => $dlStart,
        ':de'  => $dlEnd,
        ':cid' => $creatorId,
        ':cl'  => $creatorName,
    ]);
    $projectId = (int)$db->lastInsertId();

    // Auto-add to Calendar View if Deadline is set!
    if ($dlStart !== null) {
        $calStmt = $db->prepare("
            INSERT INTO calendar_events (title, description, tag, priority, preset_type, start_datetime, end_datetime, linked_project_id, added_by_user_id, added_by_label)
            VALUES (:t, :d, 'Project Deadline', :p, 'project_sync', :s, :e, :pid, :uid, :lbl)
        ");
        $calStmt->execute([
            ':t'   => "[Project] " . $name,
            ':d'   => $desc,
            ':p'   => $priority,
            ':s'   => $dlStart,
            ':e'   => $dlEnd ?? $dlStart,
            ':pid' => $projectId,
            ':uid' => $creatorId,
            ':lbl' => $creatorName,
        ]);
    }

    echo json_encode(['ok' => true, 'projectId' => $projectId, 'calendarSynced' => ($dlStart !== null)]);
    exit;
}

echo json_encode(['ok' => true, 'service' => 'STF-NHS PHP 8.2 + MySQL 8.0 Upgradable API']);
