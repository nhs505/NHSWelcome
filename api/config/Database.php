<?php
declare(strict_types=1);

namespace NHS\Config;

use PDO;
use PDOException;

/**
 * Upgradable PDO Database Connection Factory
 * Supports MySQL 8.0+ (default), MariaDB, PostgreSQL, and SQLite via environment variables.
 */
class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $driver  = getenv('NHS_DB_DRIVER') ?: 'mysql'; // Upgradeable to 'pgsql' or 'sqlite'
        $host    = getenv('NHS_DB_HOST')   ?: '127.0.0.1';
        $port    = getenv('NHS_DB_PORT')   ?: '3306';
        $dbName  = getenv('NHS_DB_NAME')   ?: 'stf_nhs_portal';
        $user    = getenv('NHS_DB_USER')   ?: 'nhs_app_user';
        $pass    = getenv('NHS_DB_PASS')   ?: '';
        $charset = 'utf8mb4';

        if ($driver === 'sqlite') {
            $dsn = "sqlite:" . (__DIR__ . "/../../database/nhs_portal.sqlite");
        } elseif ($driver === 'pgsql') {
            $dsn = "pgsql:host={$host};port={$port};dbname={$dbName}";
        } else {
            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}";
        }

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Strict native prepared statements (SQLi immunity)
        ];

        try {
            self::$instance = new PDO($dsn, $user, $pass, $options);
            return self::$instance;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'ok'    => false,
                'error' => 'Database connection error. Verify api/config/Database.php credentials.',
            ]);
            exit;
        }
    }
}
