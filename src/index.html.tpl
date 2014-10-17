<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>


    <!-- bower:js -->
    <!-- endinject -->

    <!-- vendors:js -->
    <!-- endinject -->

    <!-- dist:js -->
    <!-- endinject -->

    <!-- inject:js -->
    <!-- endinject -->

    <style>
        body {
            background-color: black;
        }
    </style>

</head>
<body>

    <div id="game"></div>

    <script>
    window.onload = function() {
        var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');

        game.state.add('Game.init', Game.init);
        game.state.add('Game.level', Game.level);

        game.state.start('Game.init');
    };
    </script>
</body>
</html>