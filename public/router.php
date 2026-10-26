<?php
/**
 * Router untuk mode pengembangan: php -S localhost:8000 -t public router.php
 * File yang benar-benar ada (CSS/JS) dilayani langsung; sisanya masuk front controller.
 * (Pada Apache/Nginx aturan rewrite di .htaccess yang melakukan hal sama.)
 */
$path = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path !== __DIR__ . '/' && file_exists($path) && !is_dir($path)) {
    return false; // layani file statis (css/js)
}
require __DIR__ . '/index.php';
