<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="minimal-ui">
    
    <title>Spel</title>


    <!-- bower:js -->
    <!-- endinject -->
    <script src="http://localhost:3001/socket.io/socket.io.js"></script>

    <!-- vendors:js -->
    <!-- endinject -->

    <!-- dist:js -->
    <!-- endinject -->

    <!-- inject:js -->
    <!-- endinject -->

    <style>
        html {
            height: 100%;
        }
        
        body {
            background: url("http://api.thumbr.it/whitenoise-361x370.png?background=202020&noise=a6a6a6&density=64&opacity=10");
            padding: 0;
            margin: 0;

            color: white;

            max-height: 100vh;
            height: 100%;
        }

        #game {
            height: 100%;
        }

        #game canvas {
            margin-left: auto;
            margin-right: auto;
            
            position: relative;
            top: 50%;
            -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
            
        }

        #topBar {
            width: 100%;
            background: url("http://api.thumbr.it/whitenoise-361x370.png?background=101010&noise=a6a6a6&density=64&opacity=10");

            position: absolute;
            left: 0;
            top: 0;
        }

        #topBar p {
            padding: 10px;
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
        <p>Press 'f11' to enter fullscreen. Up-arrrow for next page in dialogue (always try to press up because there is no indiciator as of yet that you should!)</p>
    </div>

    <div id="game"></div>

    <script>
    window.onload = function() {
        if (typeof require !== 'undefined') {
            self._ = require('lodash');
        }

        var game = new Phaser.Game(1600, 900, Phaser.CANVAS, 'game');

        game.state.add('Game.Init', Game.Init);
        game.state.add('Game.MainMenu', Game.MainMenu);
        game.state.add('Game.Level', Game.Level);

        game.state.start('Game.Init');
    };
    </script>
</body>
</html>