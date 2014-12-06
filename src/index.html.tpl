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
            background-color: #202020;
            padding: 0;
            margin: 0;

            color: white;
        }

        #game {
            height: 100vh;
        }

        #topBar {
            width: 100%;
            padding: 10px;
            background-color: #101010;

            position: absolute;
            left: 0;
            top: 0;
        }
    
        @media screen and (max-height: 850px) {
            #topBar {
                display: none;
            }
        }
    </style>

</head>
<body>
    <div id="topBar">
        <p>Press 'f11' to enter fullscreen</p>
    </div>

    <div id="game"></div>

    <script>
    window.onload = function() {
        var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'game');

        game.state.add('Game.Init', Game.Init);
        game.state.add('Game.Level', Game.Level);

        game.state.start('Game.Init');
    };
    </script>
</body>
</html>