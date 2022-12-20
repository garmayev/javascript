<?php
require "php/manager.php";
$manager = new Manager();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>File Manager</title>
    <script crossorigin src="//unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="//unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script crossorigin src="//unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script crossorigin src="//kit.fontawesome.com/aa23fe1476.js"></script>
    <link rel="icon" type="image/png" href="favicon.png"/>
    <link rel="stylesheet" href="css/index.css">
</head>
<body>
<div class="manager"></div>
<script src="js/index.js" type="module"></script>
</body>
</html>