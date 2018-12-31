define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyApp {
        constructor() {
            this._lastFPS = new Date();
            this.keytimer = 0;
            this.paused = false;
            this.touchDirection = '';
            this.touchX_Start = 0;
            this.touchY_Start = 0;
            this.lastTouch = new Date();
            this.draw = false;
            this.lastCalledTime = new Date();
            this.fpscounter = 0;
            this.currentfps = 0;
            this.bindRivets();
            this.createGameTable();
            this.initGame();
            requestAnimationFrame(this.requestNextFrame);
            $('#divMain')[0].addEventListener('touchstart', this.touchStart, false);
            $('#divMain')[0].addEventListener('touchend', this.touchEnd, false);
            $('#divMain')[0].addEventListener('touchmove', this.touchMove, false);
        }
        touchEnd(event) {
            let app = window.myApp;
            app.touchDirection = '';
        }
        touchStart(event) {
            let app = window.myApp;
            //PREVENT DOUBLE TAP ZOOM ON IOS
            let delta = (new Date().getTime() - app.lastTouch.getTime());
            if (delta < 500) {
                event.preventDefault();
            }
            app.lastTouch = new Date();
            app.touchX_Start = event.touches[0].clientX;
            app.touchY_Start = event.touches[0].clientY;
        }
        touchMove(event) {
            event.preventDefault();
            let app = window.myApp;
            if (event.touches[0].clientX < app.touchX_Start)
                app.touchDirection = 'left';
            if (event.touches[0].clientX > app.touchX_Start)
                app.touchDirection = 'right';
        }
        bindRivets() {
            rivets.bind($('body'), { data: this });
        }
        Tetris_KeyUp() {
            //   if (e.Key == Key.Up)
            //     upKey=true;
            //   if (e.Key == Key.Down)
            //     downKey=false;
            //   if (e.Key == Key.Left)
            //   {
            //     leftKey=false;
            //     keytimer = 0;
            //   }
            //   if (e.Key == Key.Right)
            //   {
            //     rightKey=false;
            //     keytimer = 0;
            //   }
        }
        Tetris_KeyDown() {
            // if (e.Key == Key.Down)
            //     downKey = true;
            // if (e.Key == Key.Left)
            // {
            //     leftKey = true;
            //     keytimer++;
            // }
            // if (e.Key == Key.Right)
            // {
            //     rightKey = true;
            //     keytimer++;
            // }
        }
        getRandomNumber(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        newGame_Click() {
            this.reset();
        }
        initGame() {
            // this.currentTime = new Date();
            this.fps = 0;
            this.gameOver = false;
            this.startGame = false;
            this.nextLevel = 0;
            this.timer = 0;
            this.piece = 0;
            this.state = 0;
            this.centX = 0;
            this.centY = 0;
            this.score = 0;
            this.level = 0;
            this.lines = 0;
            this.nextPiece = this.getRandomNumber(7) + 1;
            this.toClear = false;
            this.toMakePiece = true;
            this.upKey = false;
            this.downKey = false;
            this.leftKey = false;
            this.rightKey = false;
            this.gameMatrix = [];
            this.gameMatrixBuffer = [];
            this.delay = 32;
            for (let i = 0; i < 20; i++) {
                let arr1 = [];
                let arr2 = [];
                this.gameMatrix.push(arr1);
                this.gameMatrixBuffer.push(arr2);
                for (let j = 0; j < 10; j++) {
                    this.gameMatrix[i][j] = 0;
                    this.gameMatrixBuffer[i][j] = 0;
                }
            }
            this.nextPieceMatrix = [];
            for (let i = 0; i < 4; i++) {
                let arr3 = [];
                this.nextPieceMatrix.push(arr3);
                for (let j = 0; j < 7; j++)
                    this.nextPieceMatrix[i][j] = 0;
            }
        }
        reset() {
            this.paused = false;
            this.gameOver = false;
            this.startGame = true;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 7; j++)
                    this.nextPieceMatrix[i][j] = 0;
            }
            this.nextLevel = 0;
            this.timer = 0;
            this.piece = 0;
            this.state = 0;
            this.centX = 0;
            this.centY = 0;
            this.score = 0;
            this.level = 1;
            this.lines = 0;
            this.nextPiece = this.getRandomNumber(7) + 1;
            this.toClear = false;
            this.toMakePiece = true;
            this.upKey = false;
            this.downKey = false;
            this.leftKey = false;
            this.rightKey = false;
            this.gameMatrix = [];
            this.gameMatrixBuffer = [];
            for (let i = 0; i < 20; i++) {
                let arr1 = [];
                let arr2 = [];
                this.gameMatrix.push(arr1);
                this.gameMatrixBuffer.push(arr2);
                for (let j = 0; j < 10; j++) {
                    this.gameMatrix[i][j] = 0;
                    this.gameMatrixBuffer[i][j] = 0;
                }
            }
        }
        requestNextFrame() {
            let myApp = window.myApp;
            myApp.gameLoop();
            requestAnimationFrame(myApp.requestNextFrame);
        }
        getMessage() {
            if (!this.draw)
                return 'start drawing';
            else
                return 'stop drawing';
        }
        countFPS() {
            this.fpscounter++;
            let delta = (new Date().getTime() - this.lastCalledTime.getTime()) / 1000;
            if (delta > 1) {
                this.currentfps = this.fpscounter;
                this.fpscounter = 0;
                this.lastCalledTime = new Date();
                // $("#fps").html(this.currentfps.toString());
            }
        }
        gameLoop() {
            this.countFPS();
            if (!this.draw)
                return;
            let xCounter = -1;
            let yCounter = 0;
            let randBlock = 0;
            let elements = $("[tetris-block]");
            let myElements = [];
            for (let i = 0; i < elements.length; i++)
                myElements.push(elements[i]);
            myElements.forEach(element => {
                xCounter++;
                let myApp = window.myApp;
                if (xCounter == 10) {
                    xCounter = 0;
                    yCounter++;
                }
                if (xCounter == 0) {
                    randBlock = myApp.getRandomNumber(10);
                }
                // 
                let x = parseInt(element.attributes["x"].value);
                let y = parseInt(element.attributes["y"].value);
                if (x == randBlock) {
                    if (element.innerText != '0') {
                        element.innerText = "0";
                        element.style["background-color"] = 'green';
                        // background-color:lightblue
                    }
                }
                else {
                    if (element.innerText != 'x') {
                        element.innerText = "x";
                        element.style["background-color"] = 'lightblue';
                    }
                }
            });
            elements.each(function (h, i) {
            });
            // console.log(this.counter);
        }
        btnClick() {
            // $("#mydiv").html('button clicked');
            if (this.draw)
                this.draw = false;
            else
                this.draw = true;
        }
        createGameTable() {
            let tableHtml = '';
            tableHtml += '<table style="margin: 0px auto;">';
            for (let i = 0; i < 20; i++) {
                tableHtml += "<tr>";
                for (let j = 0; j < 10; j++) {
                    let piece = 'x';
                    // if (i==5)
                    //     piece = '';
                    // if (j == 0)
                    //     piece = i.toString();
                    tableHtml += "<td tetris-block x='" + j + "' y='" + i +
                        "' style='width:20px;height:20px;background-color:lightblue;" +
                        "border:1px black solid;font-size: .75rem;'>" + piece + "</td>";
                }
                tableHtml += "</tr>";
            }
            tableHtml += "</table>";
            $("#gamediv").html(tableHtml);
        }
    }
    exports.MyApp = MyApp;
    window.myApp = new MyApp();
});
//# sourceMappingURL=index.js.map