<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Create all writable directories in /tmp
foreach ([
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/storage/app/public',
    '/tmp/storage/bootstrap/cache',
] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Copy cached files if they exist
foreach (['cache', 'views'] as $type) {
    $src = __DIR__ . "/../storage/framework/$type";
    $dst = "/tmp/storage/framework/$type";
    if (is_dir($src)) {
        shell_exec("cp -rn $src/* $dst/ 2>/dev/null");
    }
}

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$app->useStoragePath('/tmp/storage');

$app->handleRequest(Request::capture());