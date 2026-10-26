<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($title ?? 'Bengkel Motor API') ?></title>
<link rel="stylesheet" href="/assets/style.css">
</head>
<body>
<header class="topbar">
  <a class="brand" href="/">🏍️ Bengkel Motor <span>API</span></a>
  <nav id="mainnav">
    <a href="/">Beranda</a>
    <a href="/pelanggan">Pelanggan</a>
    <a href="/mekanik">Mekanik</a>
    <a href="/admin">Admin</a>
    <span id="nav-user" class="badge-user"></span>
    <button id="btn-logout" class="btn btn-sm hidden">Keluar</button>
  </nav>
</header>
<main class="container">
