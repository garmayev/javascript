<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>File Manager</title>
        <script src="js/manager.js"></script>
        <script src="//kit.fontawesome.com/aa23fe1476.js" crossorigin="anonymous"></script>
        <link rel="icon" type="image/png" href="favicon.png"/>
        <link rel="stylesheet" href="css/index.css">
    </head>
    <body>
        <div class="manager"></div>
        <div class="modal">
            <div class="modal-header"></div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <span class="btn btn-danger f-left cancel">Cancel</span>
                <span class="btn btn-success f-right save">Save</span>
            </div>
        </div>
        <div class="shadow"></div>
    </body>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            let manager = new Manager('.manager', '<?= $_SERVER["DOCUMENT_ROOT"] ?>');
        })
    </script>
</html>