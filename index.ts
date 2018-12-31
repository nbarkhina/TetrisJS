declare var window, rivets;


export class MyApp {


    _fps: number;
    _lastFPS = new Date();
    upKey: boolean
    downKey: boolean;
    leftKey: boolean;
    rightKey: boolean;
    gameMatrix: number[][];
    gameMatrixBuffer: number[][];
    nextPieceMatrix: number[][];
    piece: number;
    timer: number;
    centX: number;
    centY: number;
    state: number;
    toMakePiece: boolean;
    toClear: boolean;
    nextPiece: number;
    score: number;
    level: number;
    levelSpeed: number;
    lines: number;
    nextLevel: number;
    startGame: boolean;
    gameOver: boolean;
    currentTime: number;
    framecounter: number;
    fps: number;
    delay: number;
    keytimer = 0;
    paused = false;

    constructor() {
        // this.bindRivets();
        this.createGameTable();
        this.initGame();

        requestAnimationFrame(this.requestNextFrame);
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

    getRandomNumber(max: number): number {
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
            let arr1: number[] = [];
            let arr2: number[] = [];
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
            let arr1: number[] = [];
            let arr2: number[] = [];
            this.gameMatrix.push(arr1);
            this.gameMatrixBuffer.push(arr2);
            for (let j = 0; j < 10; j++) {
                this.gameMatrix[i][j] = 0;
                this.gameMatrixBuffer[i][j] = 0;
            }

        }
    }

    requestNextFrame(){
        let myApp:MyApp = window.myApp;
        myApp.gameLoop();
        requestAnimationFrame(myApp.requestNextFrame);  
    }


    draw:boolean = false;

    lastCalledTime = new Date();
    fpscounter = 0;
    currentfps = 0;
    countFPS(){
        this.fpscounter++;
        let delta = (new Date().getTime() - this.lastCalledTime.getTime())/1000;
        if (delta>1)
        {
            this.currentfps = this.fpscounter;
            this.fpscounter = 0;
            this.lastCalledTime = new Date();
            $("#fps").html(this.currentfps.toString());
        }


    }



    gameLoop(){
        this.countFPS();
        if (!this.draw)
            return;
        let xCounter = -1;
        let yCounter = 0;
        let randBlock = 0;
        let elements = $("[tetris-block]");
        let myElements:HTMLElement[] = [];

        elements.each(function(h,i){
            myElements.push(i);
        });

        myElements.forEach(element => {
            xCounter++;
            let myApp:MyApp = window.myApp;
            if (xCounter==10)
            {
                xCounter = 0;
                yCounter++;
            }
            if (xCounter==0)
            {
                randBlock = myApp.getRandomNumber(10);
            }
            // 
            let x = parseInt( element.attributes["x"].value );
            let y = parseInt( element.attributes["y"].value );

            if (x==randBlock)
                element.innerHTML = "0";
            else
                element.innerHTML = "x";
        });



        elements.each(function(h,i){
            

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
                    "' style='width:20px;height:30px;background-color:lightblue;'>" + piece + "</td>";
            }
            tableHtml += "</tr>";
        }
        tableHtml += "</table>";

        $("#gamediv").html(tableHtml);
    }


}

window.myApp = new MyApp();