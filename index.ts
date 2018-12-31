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
        this.bindRivets();
        this.createGameTable();
        this.initGame();

        requestAnimationFrame(this.requestNextFrame);

        

        $('#divMain')[0].addEventListener( 'touchstart', this.touchStart, false );
        $('#divMain')[0].addEventListener( 'touchend', this.touchEnd, false );
        $('#divMain')[0].addEventListener( 'touchmove', this.touchMove, false );

        // document.addEventListener( 'keypress', this.keyPress, false );
        document.onkeydown = this.keyDown; //function(ev){console.log(ev)};
        document.onkeyup = this.keyUp;
        
        // $('#btnStart')[0].addEventListener( 'touchstart', this.dontPrevent, false );
        // document.getElementById('btnStart').ontouchmove = function(e){};
    }


    keyDown(event:KeyboardEvent)
    {
        let app = window.myApp as MyApp;

        // if (event.key=='ArrowLeft')
        //     app.moveLeft();
        // if (event.key=='ArrowRight')
        //     app.moveRight();
        // if (event.key=='ArrowDown')
        //     app.moveDown();
        // if (event.key=='ArrowUp')
        //     app.rotate();

        if (event.key=='ArrowDown')
            app.downKey = true;

        if (event.key=='ArrowLeft')
        {
            app.leftKey = true;
            app.keytimer++;
        }
        if (event.key=='ArrowRight')
        {
            app.rightKey = true;
            app.keytimer++;
        }
        
    }

    keyUp(event:KeyboardEvent)
    {
        let app = window.myApp as MyApp;

        if (event.key=='ArrowUp')
            app.upKey=true;

        if (event.key=='ArrowDown')
            app.downKey=false;

        if (event.key=='ArrowLeft')
        {
            app.leftKey=false;
            app.keytimer = 0;
        }
        if (event.key=='ArrowRight')
        {
            app.rightKey=false;
            app.keytimer = 0;
        }
    }

    touchDirection:string='';
    touchX_Start:number=0;
    touchY_Start:number=0;
    lastTouch = new Date();

    touchEnd(event:TouchEvent){
        
        let app = window.myApp as MyApp;
        if (app.touchDirection=='left')
            app.moveLeft();
        if (app.touchDirection=='right')
            app.moveRight();
        app.touchDirection = '';
    }



    touchStart(event:TouchEvent){
        
        let app = window.myApp as MyApp;

        //PREVENT DOUBLE TAP ZOOM ON IOS
        let delta = (new Date().getTime() - app.lastTouch.getTime());
        if (delta<500)
        {
            event.preventDefault();    
        }
        app.lastTouch = new Date();

        app.touchX_Start = event.touches[0].clientX;
        app.touchY_Start = event.touches[0].clientY;
    }

    touchMove(event:TouchEvent){
        event.preventDefault();
        let app = window.myApp as MyApp;
        if (event.touches[0].clientX<app.touchX_Start)
            app.touchDirection = 'left';
        if (event.touches[0].clientX>app.touchX_Start)
            app.touchDirection = 'right';
    }

    bindRivets() {
        rivets.bind($('body'), { data: this });
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

    gameLoop()
    {
        //program loop
        if (!this.startGame)
        {

            return;
        }
        if (this.paused)
        {

            return;
        }

        if (this.level == 1)
            this.levelSpeed = 30;
        if (this.level == 2)
        this.levelSpeed = 25;
        if (this.level == 3)
        this.levelSpeed = 20;
        if (this.level == 4)
        this.levelSpeed = 17;
        if (this.level == 5)
        this.levelSpeed = 14;
        if (this.level == 6)
        this.levelSpeed = 10;
        if (this.level == 7)
        this.levelSpeed = 8;
        if (this.level == 8)
        this.levelSpeed = 5;
        if (this.level == 9)
        this.levelSpeed = 3;
        if (this.level == 10)
        this.levelSpeed = 2;
        if (this.timer == -1)
        this.checkMatrix();
        if (this.toClear)
        this.timer--;
        else
        this.timer++;
        if (this.timer == -24)
        {
            this.clearBlocks();
            this.toClear = false;
            this.timer = 0;
        }
        if (this.toMakePiece && this.timer >= 0)
        {
            this.makePiece();
            this.toMakePiece = false;
        }
        if (this.upKey && !this.toClear)
        {
            this.rotate();
            this.upKey = false;
        }
        if (this.downKey && !this.toClear)
            this.moveDown();
        if (this.leftKey && !this.toClear && this.keytimer != 2)
        {
            this.moveLeft();
            this.keytimer++;
        }

        if (this.rightKey && !this.toClear && this.keytimer != 2)
        {
            this.moveRight();
            this.keytimer++;
        }

        if (this.timer == this.levelSpeed)
        {
            this.timer = 0;
            this.moveDown();
        }

        
    } 

    gameover()
    {
        this.startGame = false;
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 7; j++)
                this.nextPieceMatrix[i][j] = 0;
        for (let i = 0; i < 20; i++)
        {
            for (let j = 0; j < 10; j++)
            {
                this.gameMatrix[i][j] = 0;
                this.gameMatrixBuffer[i][j] = 0;
            }

        }
        this.gameOver = true;
    }

    makePiece()
    {
        this.piece = this.nextPiece;
        this.nextPiece = this.getRandomNumber(7) +1;
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 7; j++)
            this.nextPieceMatrix[i][j] = 0;
        if (this.gameMatrix[1][4] != 0)
        {
            this.gameover();
            return;
        }
        if (this.nextPiece == 1)
        {
            this.nextPieceMatrix[1][4] = 1;
            this.nextPieceMatrix[2][4] = 1;
            this.nextPieceMatrix[2][3] = 1;
            this.nextPieceMatrix[2][5] = 1;
        }
        if (this.nextPiece == 2)
        {
            this.nextPieceMatrix[1][5] = 2;
            this.nextPieceMatrix[1][4] = 2;
            this.nextPieceMatrix[2][4] = 2;
            this.nextPieceMatrix[2][3] = 2;
        }
        if (this.nextPiece == 3)
        {
            this.nextPieceMatrix[1][3] = 3;
            this.nextPieceMatrix[1][4] = 3;
            this.nextPieceMatrix[2][4] = 3;
            this.nextPieceMatrix[2][5] = 3;
        }
        if (this.nextPiece == 4)
        {
            this.nextPieceMatrix[1][5] = 4;
            this.nextPieceMatrix[2][5] = 4;
            this.nextPieceMatrix[2][4] = 4;
            this.nextPieceMatrix[2][3] = 4;
        }
        if (this.nextPiece == 5)
        {
            this.nextPieceMatrix[1][3] = 5;
            this.nextPieceMatrix[2][3] = 5;
            this.nextPieceMatrix[2][4] = 5;
            this.nextPieceMatrix[2][5] = 5;
        }
        if (this.nextPiece == 6)
        {
            this.nextPieceMatrix[1][5] = 6;
            this.nextPieceMatrix[1][4] = 6;
            this.nextPieceMatrix[2][4] = 6;
            this.nextPieceMatrix[2][5] = 6;
        }
        if (this.nextPiece == 7)
        {
            this.nextPieceMatrix[0][4] = 7;
            this.nextPieceMatrix[1][4] = 7;
            this.nextPieceMatrix[2][4] = 7;
            this.nextPieceMatrix[3][4] = 7;
        }
        if (this.piece == 1)
        {
            this.gameMatrixBuffer[0][5] = 1;
            this.gameMatrixBuffer[1][5] = 1;
            this.gameMatrixBuffer[1][4] = 1;
            this.gameMatrixBuffer[1][6] = 1;
            this.centX = 5;
            this.centY = 1;
            this.state = 1;
        }
        if (this.piece == 2)
        {
            this.gameMatrixBuffer[0][5] = 2;
            this.gameMatrixBuffer[0][4] = 2;
            this.gameMatrixBuffer[1][4] = 2;
            this.gameMatrixBuffer[1][3] = 2;
            this.centX = 4;
            this.centY = 1;
            this.state = 1;
        }
        if (this.piece == 3)
        {
            this.gameMatrixBuffer[0][3] = 3;
            this.gameMatrixBuffer[0][4] = 3;
            this.gameMatrixBuffer[1][4] = 3;
            this.gameMatrixBuffer[1][5] = 3;
            this.centX = 4;
            this.centY = 1;
            this.state = 1;
        }
        if (this.piece == 4)
        {
            this.gameMatrixBuffer[0][5] = 4;
            this.gameMatrixBuffer[1][5] = 4;
            this.gameMatrixBuffer[1][4] = 4;
            this.gameMatrixBuffer[1][3] = 4;
            this.centX = 4;
            this.centY = 1;
            this.state = 1;
        }
        if (this.piece == 5)
        {
            this.gameMatrixBuffer[0][3] = 5;
            this.gameMatrixBuffer[1][3] = 5;
            this.gameMatrixBuffer[1][4] = 5;
            this.gameMatrixBuffer[1][5] = 5;
            this.centX = 4;
            this.centY = 1;
            this.state = 1;
        }
        if (this.piece == 6)
        {
            this.gameMatrixBuffer[0][5] = 6;
            this.gameMatrixBuffer[0][4] = 6;
            this.gameMatrixBuffer[1][4] = 6;
            this.gameMatrixBuffer[1][5] = 6;
        }
        if (this.piece == 7)
        {
            this.gameMatrixBuffer[0][5] = 7;
            this.gameMatrixBuffer[1][5] = 7;
            this.gameMatrixBuffer[2][5] = 7;
            this.gameMatrixBuffer[3][5] = 7;
            this.centX = 5;
            this.centY = 1;
            this.state = 1;
        }
        if (this.gameMatrix[1][4] != 0)
            this.gameover();
    }

    moveLeft()
    {
        let success = true;
        for (let i = 0; i < 10; i++)
        {
            for (let j = 0; j < 20; j++)
            {
                if (this.gameMatrixBuffer[j][i] != 0 && i == 0)
                    success = false;
                if (this.gameMatrixBuffer[j][i] != 0 && i != 0 && this.gameMatrix[j][i - 1] != 0)
                    success = false;
            }
        }
        if (success)
        {
            this.centX -= 1;
            for (let i = 1; i < 10; i++)
            {
                for (let j = 0; j < 20; j++)
                {
                    if (this.gameMatrixBuffer[j][i] != 0)
                    {
                        this.gameMatrixBuffer[j][i - 1] = this.gameMatrixBuffer[j][i];
                        this.gameMatrixBuffer[j][i] = 0;
                    }
                }
            }
        }

    }

    moveRight()
    {
        let success = true;
        for (let i = 9; i > -1; i--)
        {
            for (let j = 0; j < 20; j++)
            {
                if (this.gameMatrixBuffer[j][i] != 0 && i == 9)
                    success = false;
                if (this.gameMatrixBuffer[j][i] != 0 && i != 9 && this.gameMatrix[j][i + 1] != 0)
                    success = false;
            }
        }
        if (success)
        {
            this.centX += 1;
            for (let i = 8; i > -1; i--)
            {
                for (let j = 0; j < 20; j++)
                {
                    if (this.gameMatrixBuffer[j][i] != 0)
                    {
                        this.gameMatrixBuffer[j][i + 1] = this.gameMatrixBuffer[j][i];
                        this.gameMatrixBuffer[j][i] = 0;
                    }
                }
            }
        }

    }

    moveDown()
    {
        let success = true;
        for (let i = 0; i < 10; i++)
        {
            for (let j = 0; j < 20; j++)
            {
                if (this.gameMatrixBuffer[j][i] != 0 && j == 19)
                    success = false;
                if (this.gameMatrixBuffer[j][i] != 0 && j != 19 && this.gameMatrix[j + 1][i] != 0)
                    success = false;
            }
        }
        if (success)
        {
            this.centY += 1;
            for (let i = 19; i > -1; i--)
            {
                for (let j = 0; j < 10; j++)
                {
                    if (this.gameMatrixBuffer[i][j] != 0)
                    {
                        this.gameMatrixBuffer[i + 1][j] = this.gameMatrixBuffer[i][j];
                        this.gameMatrixBuffer[i][j] = 0;
                    }
                }
            }
            this.timer = 0;
        }
        else
        {
            for (let i = 0; i < 20; i++)
            {
                for (let j = 0; j < 10; j++)
                {
                    if (this.gameMatrixBuffer[i][j] != 0)
                    {
                        this.gameMatrix[i][j] = this.gameMatrixBuffer[i][j];
                        this.gameMatrixBuffer[i][j] = 0;
                    }
                }
            }
            this.toMakePiece = true;
            this.timer = -1;
        }
    }

    rotate()
    {
        if (this.piece == 1)
        {
            if (this.state == 1)
            {
                if (this.centY != 19 && this.gameMatrix[this.centY + 1][this.centX] == 0)
                {
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                    this.state = 2;
                    return;
                }
            }
            if (this.state == 2)
            {
                if (this.centX != 0 && this.gameMatrix[this.centY][this.centX - 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.state = 3;
                    return;
                }
            }
            if (this.state == 3)
            {
                if (this.gameMatrix[this.centY - 1][this.centX] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                    this.state = 4;
                    return;
                }
            }
            if (this.state == 4)
            {
                if (this.centX != 9 && this.gameMatrix[this.centY][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.state = 1;
                    return;
                }
            }
        }//this.piece 1
        if (this.piece == 2)
        {
            if (this.state == 1)
            {
                if (this.centY != 19 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                    this.state = 2;
                    return;
                }
            }
            if (this.state == 2)
            {
                if (this.centX != 9 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                    this.state = 1;
                    return;
                }
            }
        }//this.piece 2
        if (this.piece == 3)
        {
            if (this.state == 1)
            {
                if (this.centY != 19 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                    this.state = 2;
                    return;
                }
            }
            if (this.state == 2)
            {
                if (this.centX != 0 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                    this.state = 1;
                    return;
                }
            }
        }//this.piece 3
        if (this.piece == 4)
        {
            if (this.state == 1)
            {
                if (this.centY != 19 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                    this.state = 2;
                    return;
                }
            }
            if (this.state == 2)
            {
                if (this.centX != 0 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.state = 3;
                    return;
                }
            }
            if (this.state == 3)
            {
                if (this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                    this.state = 4;
                    return;
                }
            }
            if (this.state == 4)
            {
                if (this.centX != 9 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.state = 1;
                    return;
                }
            }
        }//this.piece 4
        if (this.piece == 5)
        {
            if (this.state == 1)
            {
                if (this.centY != 19 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY - 1][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = 0;
                    this.state = 2;
                    return;
                }
            }
            if (this.state == 2)
            {
                if (this.centX != 0 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX + 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX + 1] = 0;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.state = 3;
                    return;
                }
            }
            if (this.state == 3)
            {
                if (this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX - 1] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0)
                {
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX + 1] = 0;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                    this.state = 4;
                    return;
                }
            }
            if (this.state == 4)
            {
                if (this.centX != 9 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0 && this.gameMatrix[this.centY - 1][this.centX - 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX - 1] = 0;
                    this.state = 1;
                    return;
                }
            }
        }//this.piece 5
        if (this.piece == 7)
        {
            if (this.state == 1)
            {
                if (this.centX != 0 && this.centX != 1 && this.centX != 9 && this.gameMatrix[this.centY][this.centX - 1] == 0 && this.gameMatrix[this.centY][this.centX - 2] == 0 && this.gameMatrix[this.centY][this.centX + 1] == 0)
                {
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 2] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = 0;
                    this.gameMatrixBuffer[this.centY + 2][this.centX] = 0;
                    this.state = 2;
                    return;
                }
            }
            if (this.state == 2)
            {
                if (this.centY != 19 && this.centY != 18 && this.gameMatrix[this.centY - 1][this.centX] == 0 && this.gameMatrix[this.centY + 1][this.centX] == 0 && this.gameMatrix[this.centY + 2][this.centX] == 0)
                {
                    this.gameMatrixBuffer[this.centY + 2][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY + 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY - 1][this.centX] = this.piece;
                    this.gameMatrixBuffer[this.centY][this.centX - 1] = 0;
                    this.gameMatrixBuffer[this.centY][this.centX - 2] = 0;
                    this.gameMatrixBuffer[this.centY][this.centX + 1] = 0;
                    this.state = 1;
                    return;
                }
            }
        }//this.piece 7
    }

    checkMatrix()
    {
        for (let i = 0; i < 20; i++)
        {
            let temp = true;
            for (let j = 0; j < 10; j++)
            {
                if (this.gameMatrix[i][j] == 0)
                    temp = false;
            }
            if (temp)
            {
                for (let k = 0; k < 10; k++)
                    this.gameMatrix[i][k] = 8;
                this.toClear = true;
            }
        }
        if (this.toClear){}
            //TODO blockclear.play();
        else
        {
            //TODO dropblock.play();
            this.score++;
        }
    }

    clearBlocks()
    {
        let tempLines = 0;
        for (let i = 0; i < 20; i++)
        {
            let temp = false;
            for (let j = 0; j < 10; j++)
            {
                if (this.gameMatrix[i][j] == 8)
                {
                    temp = true;
                    for (let k = i; k > 0; k--)
                    {
                        this.gameMatrix[k][j] = this.gameMatrix[k - 1][j];
                    }
                    this.gameMatrix[0][j] = 0;
                }
            }
            if (temp)
                tempLines++;

        }
        if (tempLines == 1)
            this.score += 50;
        if (tempLines == 2)
            this.score += 100;
        if (tempLines == 3)
            this.score += 300;
        if (tempLines == 4)
            this.score += 1000;
        this.lines += tempLines;
        this.nextLevel += tempLines;
        if (this.nextLevel >= 10)
        {
            //TODO newlevel.play();
            this.nextLevel -= 10;
            this.level++;
        }
        else
            ;//TODO blockcleared.play();
    }

    // public void paint()
    // {


    //     if (this.paused)
    //     {

    //     }
    //     else if (!this.gameOver)
    //     {
    //         draw next piece
    //         for (int i = 0; i < 4; i++)
    //         {
    //             for (int j = 0; j < 7; j++)
    //             {
    //                 if (nextPieceMatrix[i][j] == 1)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Blue,Colors.White);
    //                 }
    //                 if (nextPieceMatrix[i][j] == 2)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Orange, Colors.White);
    //                 }
    //                 if (nextPieceMatrix[i][j] == 3)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Purple, Colors.White);
    //                 }
    //                 if (nextPieceMatrix[i][j] == 4)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Red, Colors.White);
    //                 }
    //                 if (nextPieceMatrix[i][j] == 5)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Cyan, Colors.White);
    //                 }
    //                 if (nextPieceMatrix[i][j] == 6)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Green, Colors.White);
    //                 }
    //                 if (nextPieceMatrix[i][j] == 7)
    //                 {
    //                     addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Yellow, Colors.White);
    //                 }
    //             }
    //         }

    //         for (let i = 0; i < 20; i++)
    //         {
    //             for (let j = 0; j < 10; j++)
    //             {
    //                 if (gameMatrixBuffer[i][j] == 1)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Colors.White);
    //                 }
    //                 if (gameMatrixBuffer[i][j] == 2)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Orange, Colors.White);
    //                 }
    //                 if (gameMatrixBuffer[i][j] == 3)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Purple, Colors.White);
    //                 }
    //                 if (gameMatrixBuffer[i][j] == 4)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Red, Colors.White);
    //                 }
    //                 if (gameMatrixBuffer[i][j] == 5)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Cyan, Colors.White);
    //                 }
    //                 if (gameMatrixBuffer[i][j] == 6)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Green, Colors.White);
    //                 }
    //                 if (gameMatrixBuffer[i][j] == 7)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Yellow, Colors.White);
    //                 }


    //                 //for clearing purposes
    //                 if (gameMatrix[i][j] == 8)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), c, Color.FromArgb(0,0,0,0));
    //                 }
    //                 if (gameMatrix[i][j] == 1)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Color.FromArgb(0, 0, 0, 0));
    //                 }
    //                 if (gameMatrix[i][j] == 2)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Orange, Color.FromArgb(0, 0, 0, 0));
    //                 }
    //                 if (gameMatrix[i][j] == 3)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Purple, Color.FromArgb(0, 0, 0, 0));
    //                 }
    //                 if (gameMatrix[i][j] == 4)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Red, Color.FromArgb(0, 0, 0, 0));
    //                 }
    //                 if (gameMatrix[i][j] == 5)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Cyan, Color.FromArgb(0, 0, 0, 0));
    //                 }
    //                 if (gameMatrix[i][j] == 6)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Green, Color.FromArgb(0, 0, 0, 0));
    //                 }
    //                 if (gameMatrix[i][j] == 7)
    //                 {
    //                     addBlock(150 + (20 * j), 50 + (20 * i), Colors.Yellow, Color.FromArgb(0, 0, 0, 0));
    //                 }

    //             }
    //         }
    //     }

    // }





    /* MY FUNCTIONS */

    requestNextFrame(){
        let app:MyApp = window.myApp;
        app.gameLoop();
        app.newPaint();
        requestAnimationFrame(app.requestNextFrame);  
    }

    getMessage():string{
        return 'New Game';
        // if (!this.draw)
        //     return 'start drawing';
        // else
        //     return 'stop drawing';
    }

    //draw:boolean = false;
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
            // $("#fps").html(this.currentfps.toString());
        }


    }

    getRandomColor():string {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    newPaint(){
        this.countFPS();
        let xCounter = -1;
        let yCounter = 0;
        let randBlock = 0;
        let elements = $("[tetris-block]");
        let myElements:HTMLElement[] = [];


        for (let i = 0;i<elements.length;i++)
            myElements.push(elements[i]);
        
        let randomColor = this.getRandomColor();

        myElements.forEach(element => {
            xCounter++;

            if (xCounter==10)
            {
                xCounter = 0;
                yCounter++;
            }
            if (xCounter==0)
            {
                randBlock = this.getRandomNumber(10);
            }

            let x = parseInt( element.attributes["x"].value );
            let y = parseInt( element.attributes["y"].value );

            if (this.gameMatrixBuffer[y][x] == 8 || this.gameMatrix[y][x] == 8)
            {
                element.style["background-color"] = randomColor;
            }
            else if (this.gameMatrixBuffer[y][x] > 0 || this.gameMatrix[y][x] > 0)
            {
                //addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Colors.White);
                element.style["background-color"] = 'blue';
            }
            else
                element.style["background-color"] = 'white';

            // if (x==randBlock)
            // {
            //     if (element.innerText!='0')
            //     {
            //         element.innerText = "0";
            //         element.style["background-color"] = 'green';
            //         // background-color:lightblue
            //     }
                    
            // }
            // else
            // {
            //     if (element.innerText!='x')
            //     {
            //         element.innerText = "x";
            //         element.style["background-color"] = 'lightblue';
            //     }
                    
            // }
                
        });



        elements.each(function(h,i){
            

        });

        // console.log(this.counter);
    }

    btnClick() {
        this.reset();
    }

    btnPause() {
        if (this.paused)
            this.paused = false;
        else
            this.paused = true;
    }

    getPauseButtonText():string{
        if (this.paused) 
            return "Resume";
        else
            return "Pause";
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

window.myApp = new MyApp();