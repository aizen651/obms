<?php

ini_set('display_errors', '0');

$rootDir = realpath(__DIR__ . '/../');

// Point storage to /tmp (writable on Vercel)
putenv('APP_STORAGE=/tmp');

$_ENV['APP_STORAGE'] = '/tmp';
$_SERVER['APP_STORAGE'] = '/tmp';

require $rootDir . '/user/vendor/autoload.php';

$app = require_once $rootDir . '/user/bootstrap/app.php';

// Override storage path
$app->useStoragePath('/tmp');

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
)->send();

$kernel->terminate($request, $response);