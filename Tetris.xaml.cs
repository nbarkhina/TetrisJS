using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace NeilGame
{
    public partial class Tetris : UserControl
    {
        private int _fps = 0;
        private DateTime _lastFPS = DateTime.Now;
        public Image[] pics;
        public Image background;
        public Image myPic;
        //public AudioClip clip;
        //public AudioClip dropblock, blockclear, blockcleared, newlevel;
        //public Image buffer;
        //public Graphics bufferGraphics;
        public bool upKey, downKey, leftKey, rightKey;
        public List<int[]> gameMatrix;
        public List<int[]> gameMatrixBuffer;
        public List<int[]> nextPieceMatrix;
        public int piece;
        public int timer;
        public int centX, centY;
        public int state;
        public bool toMakePiece, toClear;
        
        //public Panel controlPanel;
        //public Klistener k;
        public int nextPiece;
        public int score, level, levelSpeed, lines, nextLevel;
        public bool startGame, gameOver;
        //public AppletContext apc;

        public long currentTime;
        public int framecounter;
        public int fps;
        public int delay;
        Random rand = new Random();
        public int keytimer = 0;
        TetrisCube cube;
        bool paused = false;

        public Tetris()
        {
            InitializeComponent();
            App.Current.Host.Settings.MaxFrameRate = 30;
            cube = new TetrisCube();
            cube.Width = 100;
            cube.Height = 100;
            cube.Margin = new Thickness(0, 0, 0, 50);
            LayoutRoot.Children.Add(cube);

            btnPause.IsEnabled = false;
            btnPause.Click += new RoutedEventHandler(btnPause_Click);
            btnHighScoreOK.Click += new RoutedEventHandler(btnHighScoreOK_Click);
            initGame();
            newGame.Click += new RoutedEventHandler(newGame_Click);
            this.KeyDown += new KeyEventHandler(Tetris_KeyDown);
            this.KeyUp += new KeyEventHandler(Tetris_KeyUp);
            CompositionTarget.Rendering += new EventHandler(CompositionTarget_Rendering);
            
        }

        void btnHighScoreOK_Click(object sender, RoutedEventArgs e)
        {
            hidePopup();
        }

        void btnPause_Click(object sender, RoutedEventArgs e)
        {
            if (!paused)
            {
                paused = true;
                btnPause.Content = "Resume Play";
            }
            else
            {
                paused = false;
                btnPause.Content = "Pause";
            }
        }

        void Tetris_KeyUp(object sender, KeyEventArgs e)
        {
              if (e.Key == Key.Up)
                upKey=true;

              if (e.Key == Key.Down)
                downKey=false;

              if (e.Key == Key.Left)
              {
                leftKey=false;
                keytimer = 0;
              }
              if (e.Key == Key.Right)
              {
                rightKey=false;
                keytimer = 0;
              }
        }

        void Tetris_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Down)
                downKey = true;

            if (e.Key == Key.Left)
            {
                leftKey = true;
                keytimer++;
            }
            if (e.Key == Key.Right)
            {
                rightKey = true;
                keytimer++;
            }
        }

        void newGame_Click(object sender, RoutedEventArgs e)
        {
            LayoutRoot.Children.Remove(cube);
            //cube.Visibility = Visibility.Collapsed;
            reset();
        }

        

        private void initGame()
        {
            txtTitleStory.Begin();

            currentTime = DateTime.Now.Ticks;
            fps = 0;
            gameOver = false;
            startGame = false;
            nextLevel = 0;
            timer = 0;
            piece = 0;
            state = 0;
            centX = 0;
            centY = 0;
            score = 0;
            level = 0;
            lines = 0;

            nextPiece = rand.Next(7)+1;
            toClear = false;
            toMakePiece = true;
            upKey = false;
            downKey = false;
            leftKey = false;
            rightKey = false;
            gameMatrix = new List<int[]>();
            gameMatrixBuffer = new List<int[]>();
            delay=32;
            for (int i = 0;i<20;i++)
            {
                int[] arr1 = new int[10];
                int[] arr2 = new int[10];
                gameMatrix.Add(arr1);
                gameMatrixBuffer.Add(arr2);
              for (int j = 0;j<10;j++)
              {
                gameMatrix[i][j] = 0;
                gameMatrixBuffer[i][j] = 0;
              }

            }
            nextPieceMatrix = new List<int[]>();
            for (int i = 0; i < 4; i++)
            {
                int[] arr3 = new int[7];
                nextPieceMatrix.Add(arr3);
                for (int j = 0; j < 7; j++)
                    nextPieceMatrix[i][j] = 0;
            }


            pics = new Image[10];
            txtGameOver.Visibility = Visibility.Collapsed;

            //pics[0] = getImage(getDocumentBase(),"1.jpg");
            //pics[1] = getImage(getDocumentBase(),"2.jpg");
            //pics[2] = getImage(getDocumentBase(),"3.jpg");
            //pics[3] = getImage(getDocumentBase(),"4.jpg");
            //pics[4] = getImage(getDocumentBase(),"5.jpg");
            //pics[5] = getImage(getDocumentBase(),"6.jpg");
            //pics[6] = getImage(getDocumentBase(),"7.jpg");
            //pics[7] = getImage(getDocumentBase(),"8.jpg");
            //pics[8] = getImage(getDocumentBase(),"9.jpg");
            //pics[9] = getImage(getDocumentBase(),"10.jpg");
            //background = getImage(getDocumentBase(),"background.jpg");
            //myPic = getImage(getDocumentBase(),"mypic.JPG");
            //clip = getAudioClip(getDocumentBase(),"sf2camm2.mid");
            //dropblock = getAudioClip(getDocumentBase(),"dropblock.wav");
            //blockclear = getAudioClip(getDocumentBase(),"blockclear.wav");
            //blockcleared = getAudioClip(getDocumentBase(),"blockcleared.wav");
            //newlevel = getAudioClip(getDocumentBase(),"newlevel.wav");


            //For double buffering

            hidePopup();
          }

        private void hidePopup()
        {
            rectSubmit.Visibility = Visibility.Collapsed;
            lblHighScore.Visibility = Visibility.Collapsed;
            lblHighScoreName.Visibility = Visibility.Collapsed;
            txtHighScore1.Visibility = Visibility.Collapsed;
            btnHighScoreOK.Visibility = Visibility.Collapsed;
        }

        private void reset()
        {
            hidePopup();

            paused = false;
            btnPause.Content = "Pause";
            txtGameOver.Visibility = Visibility.Collapsed;
            txtTitle.Visibility = Visibility.Collapsed;
            imgMe.Visibility = Visibility.Collapsed;
            txtProgrammedBy.Visibility = Visibility.Collapsed;
            btnPause.IsEnabled = true;
            gameOver = false;
            startGame = true;
            
            //TODO: PLAY SONG
            
            
            for (int i = 0;i<4;i++)
              for (int j = 0; j<7;j++)
                nextPieceMatrix[i][j] = 0;

            nextLevel = 0;
            timer = 0;
            piece = 0;
            state = 0;
            centX = 0;
            centY = 0;
            score = 0;
            level = 1;
            lines = 0;

            nextPiece = rand.Next(7) +1;
            toClear = false;
            toMakePiece = true;
            upKey = false;
            downKey = false;
            leftKey = false;
            rightKey = false;
            gameMatrix = new List<int[]>();
            gameMatrixBuffer = new List<int[]>();
            for (int i = 0;i<20;i++)
            {
                int[] arr1 = new int[10];
                int[] arr2 = new int[10];
                gameMatrix.Add(arr1);
                gameMatrixBuffer.Add(arr2);
              for (int j = 0;j<10;j++)
              {
                gameMatrix[i][j] = 0;
                gameMatrixBuffer[i][j] = 0;
              }

            }
        }

        void CompositionTarget_Rendering(object sender, EventArgs e)
        {
            clearCanvas();
            calculateFPS();
            //txtKeyTimer.Text = "Key Timer: " + timer.ToString();
            gameLoop();
        }

        private void gameLoop()
        {
            //program loop
            if (!startGame)
            {
                paint();
                return;
            }
            if (paused)
            {
                paint();
                return;
            }

            if (level == 1)
                levelSpeed = 30;
            if (level == 2)
                levelSpeed = 25;
            if (level == 3)
                levelSpeed = 20;
            if (level == 4)
                levelSpeed = 17;
            if (level == 5)
                levelSpeed = 14;
            if (level == 6)
                levelSpeed = 10;
            if (level == 7)
                levelSpeed = 8;
            if (level == 8)
                levelSpeed = 5;
            if (level == 9)
                levelSpeed = 3;
            if (level == 10)
                levelSpeed = 2;
            if (timer == -1)
                checkMatrix();
            if (toClear)
                timer--;
            else
                timer++;
            if (timer == -24)
            {
                clearBlocks();
                toClear = false;
                timer = 0;
            }
            if (toMakePiece && timer >= 0)
            {
                makePiece();
                toMakePiece = false;
            }
            if (upKey && !toClear)
            {
                this.rotate();
                upKey = false;
            }
            if (downKey && !toClear)
                this.moveDown();
            if (leftKey && !toClear && keytimer != 2)
            {
                this.moveLeft();
                keytimer++;
            }

            if (rightKey && !toClear && keytimer != 2)
            {
                this.moveRight();
                keytimer++;
            }

            if (timer == levelSpeed)
            {
                timer = 0;
                moveDown();
            }
            paint();
            
        }

        public void gameover()
        {
            //cube.Visibility = Visibility.Visible;
            //cube.Margin = new Thickness(0, 0, 0, 0);
            
            btnPause.IsEnabled = false;
            txtGameOver.Text = "Game Over";
            startGame = false;
            //TODO: clip.stop();
            for (int i = 0; i < 4; i++)
                for (int j = 0; j < 7; j++)
                    nextPieceMatrix[i][j] = 0;
            for (int i = 0; i < 20; i++)
            {
                for (int j = 0; j < 10; j++)
                {
                    gameMatrix[i][j] = 0;
                    gameMatrixBuffer[i][j] = 0;
                }

            }
            gameOver = true;
            txtGameOver.Visibility = Visibility.Visible;
            storySubmit.Begin();
            //rectSubmit.Visibility = Visibility.Visible;
        }

        public void makePiece()
        {
            piece = nextPiece;
            nextPiece = rand.Next(7) +1;
            for (int i = 0; i < 4; i++)
                for (int j = 0; j < 7; j++)
                    nextPieceMatrix[i][j] = 0;
            if (gameMatrix[1][4] != 0)
                gameover();
            if (nextPiece == 1)
            {
                nextPieceMatrix[1][4] = 1;
                nextPieceMatrix[2][4] = 1;
                nextPieceMatrix[2][3] = 1;
                nextPieceMatrix[2][5] = 1;
            }
            if (nextPiece == 2)
            {
                nextPieceMatrix[1][5] = 2;
                nextPieceMatrix[1][4] = 2;
                nextPieceMatrix[2][4] = 2;
                nextPieceMatrix[2][3] = 2;
            }
            if (nextPiece == 3)
            {
                nextPieceMatrix[1][3] = 3;
                nextPieceMatrix[1][4] = 3;
                nextPieceMatrix[2][4] = 3;
                nextPieceMatrix[2][5] = 3;
            }
            if (nextPiece == 4)
            {
                nextPieceMatrix[1][5] = 4;
                nextPieceMatrix[2][5] = 4;
                nextPieceMatrix[2][4] = 4;
                nextPieceMatrix[2][3] = 4;
            }
            if (nextPiece == 5)
            {
                nextPieceMatrix[1][3] = 5;
                nextPieceMatrix[2][3] = 5;
                nextPieceMatrix[2][4] = 5;
                nextPieceMatrix[2][5] = 5;
            }
            if (nextPiece == 6)
            {
                nextPieceMatrix[1][5] = 6;
                nextPieceMatrix[1][4] = 6;
                nextPieceMatrix[2][4] = 6;
                nextPieceMatrix[2][5] = 6;
            }
            if (nextPiece == 7)
            {
                nextPieceMatrix[0][4] = 7;
                nextPieceMatrix[1][4] = 7;
                nextPieceMatrix[2][4] = 7;
                nextPieceMatrix[3][4] = 7;
            }
            if (piece == 1)
            {
                gameMatrixBuffer[0][5] = 1;
                gameMatrixBuffer[1][5] = 1;
                gameMatrixBuffer[1][4] = 1;
                gameMatrixBuffer[1][6] = 1;
                centX = 5;
                centY = 1;
                state = 1;
            }
            if (piece == 2)
            {
                gameMatrixBuffer[0][5] = 2;
                gameMatrixBuffer[0][4] = 2;
                gameMatrixBuffer[1][4] = 2;
                gameMatrixBuffer[1][3] = 2;
                centX = 4;
                centY = 1;
                state = 1;
            }
            if (piece == 3)
            {
                gameMatrixBuffer[0][3] = 3;
                gameMatrixBuffer[0][4] = 3;
                gameMatrixBuffer[1][4] = 3;
                gameMatrixBuffer[1][5] = 3;
                centX = 4;
                centY = 1;
                state = 1;
            }
            if (piece == 4)
            {
                gameMatrixBuffer[0][5] = 4;
                gameMatrixBuffer[1][5] = 4;
                gameMatrixBuffer[1][4] = 4;
                gameMatrixBuffer[1][3] = 4;
                centX = 4;
                centY = 1;
                state = 1;
            }
            if (piece == 5)
            {
                gameMatrixBuffer[0][3] = 5;
                gameMatrixBuffer[1][3] = 5;
                gameMatrixBuffer[1][4] = 5;
                gameMatrixBuffer[1][5] = 5;
                centX = 4;
                centY = 1;
                state = 1;
            }
            if (piece == 6)
            {
                gameMatrixBuffer[0][5] = 6;
                gameMatrixBuffer[0][4] = 6;
                gameMatrixBuffer[1][4] = 6;
                gameMatrixBuffer[1][5] = 6;
            }
            if (piece == 7)
            {
                gameMatrixBuffer[0][5] = 7;
                gameMatrixBuffer[1][5] = 7;
                gameMatrixBuffer[2][5] = 7;
                gameMatrixBuffer[3][5] = 7;
                centX = 5;
                centY = 1;
                state = 1;
            }
            if (gameMatrix[1][4] != 0)
                gameover();
        }
        public void moveLeft()
        {
            bool success = true;
            for (int i = 0; i < 10; i++)
            {
                for (int j = 0; j < 20; j++)
                {
                    if (gameMatrixBuffer[j][i] != 0 && i == 0)
                        success = false;
                    if (gameMatrixBuffer[j][i] != 0 && i != 0 && gameMatrix[j][i - 1] != 0)
                        success = false;
                }
            }
            if (success)
            {
                centX -= 1;
                for (int i = 1; i < 10; i++)
                {
                    for (int j = 0; j < 20; j++)
                    {
                        if (gameMatrixBuffer[j][i] != 0)
                        {
                            gameMatrixBuffer[j][i - 1] = gameMatrixBuffer[j][i];
                            gameMatrixBuffer[j][i] = 0;
                        }
                    }
                }
            }

        }
        public void moveRight()
        {
            bool success = true;
            for (int i = 9; i > -1; i--)
            {
                for (int j = 0; j < 20; j++)
                {
                    if (gameMatrixBuffer[j][i] != 0 && i == 9)
                        success = false;
                    if (gameMatrixBuffer[j][i] != 0 && i != 9 && gameMatrix[j][i + 1] != 0)
                        success = false;
                }
            }
            if (success)
            {
                centX += 1;
                for (int i = 8; i > -1; i--)
                {
                    for (int j = 0; j < 20; j++)
                    {
                        if (gameMatrixBuffer[j][i] != 0)
                        {
                            gameMatrixBuffer[j][i + 1] = gameMatrixBuffer[j][i];
                            gameMatrixBuffer[j][i] = 0;
                        }
                    }
                }
            }

        }
        public void moveDown()
        {
            bool success = true;
            for (int i = 0; i < 10; i++)
            {
                for (int j = 0; j < 20; j++)
                {
                    if (gameMatrixBuffer[j][i] != 0 && j == 19)
                        success = false;
                    if (gameMatrixBuffer[j][i] != 0 && j != 19 && gameMatrix[j + 1][i] != 0)
                        success = false;
                }
            }
            if (success)
            {
                centY += 1;
                for (int i = 19; i > -1; i--)
                {
                    for (int j = 0; j < 10; j++)
                    {
                        if (gameMatrixBuffer[i][j] != 0)
                        {
                            gameMatrixBuffer[i + 1][j] = gameMatrixBuffer[i][j];
                            gameMatrixBuffer[i][j] = 0;
                        }
                    }
                }
                timer = 0;
            }
            else
            {
                for (int i = 0; i < 20; i++)
                {
                    for (int j = 0; j < 10; j++)
                    {
                        if (gameMatrixBuffer[i][j] != 0)
                        {
                            gameMatrix[i][j] = gameMatrixBuffer[i][j];
                            gameMatrixBuffer[i][j] = 0;
                        }
                    }
                }
                toMakePiece = true;
                timer = -1;
            }
        }

        public void rotate()
        {
            if (piece == 1)
            {
                if (state == 1)
                {
                    if (centY != 19 && gameMatrix[centY + 1][centX] == 0)
                    {
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY][centX - 1] = 0;
                        state = 2;
                        return;
                    }
                }
                if (state == 2)
                {
                    if (centX != 0 && gameMatrix[centY][centX - 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX - 1] = piece;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        state = 3;
                        return;
                    }
                }
                if (state == 3)
                {
                    if (gameMatrix[centY - 1][centX] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY][centX + 1] = 0;
                        state = 4;
                        return;
                    }
                }
                if (state == 4)
                {
                    if (centX != 9 && gameMatrix[centY][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX + 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        state = 1;
                        return;
                    }
                }
            }//piece 1
            if (piece == 2)
            {
                if (state == 1)
                {
                    if (centY != 19 && gameMatrix[centY + 1][centX] == 0 && gameMatrix[centY - 1][centX - 1] == 0)
                    {
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX - 1] = piece;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        gameMatrixBuffer[centY - 1][centX + 1] = 0;
                        state = 2;
                        return;
                    }
                }
                if (state == 2)
                {
                    if (centX != 9 && gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY - 1][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX + 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        gameMatrixBuffer[centY - 1][centX - 1] = 0;
                        state = 1;
                        return;
                    }
                }
            }//piece 2
            if (piece == 3)
            {
                if (state == 1)
                {
                    if (centY != 19 && gameMatrix[centY + 1][centX] == 0 && gameMatrix[centY - 1][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX + 1] = piece;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        gameMatrixBuffer[centY - 1][centX - 1] = 0;
                        state = 2;
                        return;
                    }
                }
                if (state == 2)
                {
                    if (centX != 0 && gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY - 1][centX - 1] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX - 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        gameMatrixBuffer[centY - 1][centX + 1] = 0;
                        state = 1;
                        return;
                    }
                }
            }//piece 3
            if (piece == 4)
            {
                if (state == 1)
                {
                    if (centY != 19 && gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY + 1][centX] == 0 && gameMatrix[centY + 1][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY + 1][centX + 1] = piece;
                        gameMatrixBuffer[centY][centX - 1] = 0;
                        gameMatrixBuffer[centY][centX + 1] = 0;
                        gameMatrixBuffer[centY - 1][centX + 1] = 0;
                        state = 2;
                        return;
                    }
                }
                if (state == 2)
                {
                    if (centX != 0 && gameMatrix[centY][centX - 1] == 0 && gameMatrix[centY + 1][centX - 1] == 0 && gameMatrix[centY][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX - 1] = piece;
                        gameMatrixBuffer[centY + 1][centX - 1] = piece;
                        gameMatrixBuffer[centY][centX + 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        gameMatrixBuffer[centY + 1][centX + 1] = 0;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        state = 3;
                        return;
                    }
                }
                if (state == 3)
                {
                    if (gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY - 1][centX - 1] == 0 && gameMatrix[centY + 1][centX] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX - 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY][centX - 1] = 0;
                        gameMatrixBuffer[centY + 1][centX - 1] = 0;
                        gameMatrixBuffer[centY][centX + 1] = 0;
                        state = 4;
                        return;
                    }
                }
                if (state == 4)
                {
                    if (centX != 9 && gameMatrix[centY][centX - 1] == 0 && gameMatrix[centY][centX + 1] == 0 && gameMatrix[centY - 1][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX - 1] = piece;
                        gameMatrixBuffer[centY][centX + 1] = piece;
                        gameMatrixBuffer[centY - 1][centX + 1] = piece;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        gameMatrixBuffer[centY - 1][centX - 1] = 0;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        state = 1;
                        return;
                    }
                }
            }//piece 4
            if (piece == 5)
            {
                if (state == 1)
                {
                    if (centY != 19 && gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY + 1][centX] == 0 && gameMatrix[centY - 1][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX + 1] = piece;
                        gameMatrixBuffer[centY][centX - 1] = 0;
                        gameMatrixBuffer[centY][centX + 1] = 0;
                        gameMatrixBuffer[centY - 1][centX - 1] = 0;
                        state = 2;
                        return;
                    }
                }
                if (state == 2)
                {
                    if (centX != 0 && gameMatrix[centY][centX - 1] == 0 && gameMatrix[centY + 1][centX + 1] == 0 && gameMatrix[centY][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX - 1] = piece;
                        gameMatrixBuffer[centY + 1][centX + 1] = piece;
                        gameMatrixBuffer[centY][centX + 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        gameMatrixBuffer[centY - 1][centX + 1] = 0;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        state = 3;
                        return;
                    }
                }
                if (state == 3)
                {
                    if (gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY + 1][centX - 1] == 0 && gameMatrix[centY + 1][centX] == 0)
                    {
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY + 1][centX - 1] = piece;
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY][centX - 1] = 0;
                        gameMatrixBuffer[centY + 1][centX + 1] = 0;
                        gameMatrixBuffer[centY][centX + 1] = 0;
                        state = 4;
                        return;
                    }
                }
                if (state == 4)
                {
                    if (centX != 9 && gameMatrix[centY][centX - 1] == 0 && gameMatrix[centY][centX + 1] == 0 && gameMatrix[centY - 1][centX - 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX - 1] = piece;
                        gameMatrixBuffer[centY][centX + 1] = piece;
                        gameMatrixBuffer[centY - 1][centX - 1] = piece;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        gameMatrixBuffer[centY + 1][centX - 1] = 0;
                        state = 1;
                        return;
                    }
                }
            }//piece 5
            if (piece == 7)
            {
                if (state == 1)
                {
                    if (centX != 0 && centX != 1 && centX != 9 && gameMatrix[centY][centX - 1] == 0 && gameMatrix[centY][centX - 2] == 0 && gameMatrix[centY][centX + 1] == 0)
                    {
                        gameMatrixBuffer[centY][centX - 1] = piece;
                        gameMatrixBuffer[centY][centX - 2] = piece;
                        gameMatrixBuffer[centY][centX + 1] = piece;
                        gameMatrixBuffer[centY - 1][centX] = 0;
                        gameMatrixBuffer[centY + 1][centX] = 0;
                        gameMatrixBuffer[centY + 2][centX] = 0;
                        state = 2;
                        return;
                    }
                }
                if (state == 2)
                {
                    if (centY != 19 && centY != 18 && gameMatrix[centY - 1][centX] == 0 && gameMatrix[centY + 1][centX] == 0 && gameMatrix[centY + 2][centX] == 0)
                    {
                        gameMatrixBuffer[centY + 2][centX] = piece;
                        gameMatrixBuffer[centY + 1][centX] = piece;
                        gameMatrixBuffer[centY - 1][centX] = piece;
                        gameMatrixBuffer[centY][centX - 1] = 0;
                        gameMatrixBuffer[centY][centX - 2] = 0;
                        gameMatrixBuffer[centY][centX + 1] = 0;
                        state = 1;
                        return;
                    }
                }
            }//piece 7
        }

        public void checkMatrix()
        {
            for (int i = 0; i < 20; i++)
            {
                bool temp = true;
                for (int j = 0; j < 10; j++)
                {
                    if (gameMatrix[i][j] == 0)
                        temp = false;
                }
                if (temp)
                {
                    for (int k = 0; k < 10; k++)
                        gameMatrix[i][k] = 8;
                    toClear = true;
                }
            }
            if (toClear)
                ;//TODO blockclear.play();
            else
            {
                //TODO dropblock.play();
                score++;
            }
        }

        public void clearBlocks()
        {
            int tempLines = 0;
            for (int i = 0; i < 20; i++)
            {
                bool temp = false;
                for (int j = 0; j < 10; j++)
                {
                    if (gameMatrix[i][j] == 8)
                    {
                        temp = true;
                        for (int k = i; k > 0; k--)
                        {
                            gameMatrix[k][j] = gameMatrix[k - 1][j];
                        }
                        gameMatrix[0][j] = 0;
                    }
                }
                if (temp)
                    tempLines++;

            }
            if (tempLines == 1)
                score += 50;
            if (tempLines == 2)
                score += 100;
            if (tempLines == 3)
                score += 300;
            if (tempLines == 4)
                score += 1000;
            lines += tempLines;
            nextLevel += tempLines;
            if (nextLevel >= 10)
            {
                //TODO newlevel.play();
                nextLevel -= 10;
                level++;
            }
            else
                ;//TODO blockcleared.play();
        }

        private void calculateFPS()
        {
            txtFPS.Visibility = Visibility.Collapsed;
            _fps++;
            if ((DateTime.Now - _lastFPS).Seconds >= 1)
            {
                txtFPS.Text = _fps.ToString() + " FPS";
                _fps = 0;
                _lastFPS = DateTime.Now;
            }
        }

        public void paint()
        {

            if (imgMe.Visibility == Visibility.Collapsed)
            {
                txtScore.Text = "Score: " + score.ToString();
                txtLines.Text = "Lines: " + lines.ToString();
                txtLevel.Text = "Level: " + level.ToString();
            }


            if (paused)
            {
                txtGameOver.Text = "Paused";
                txtGameOver.Visibility = Visibility.Visible;
            }
            else if (!gameOver)
            {
                txtGameOver.Visibility = Visibility.Collapsed;

                //if (level == 1)
                //    bufferGraphics.drawImage(pics[0], 150, 50, this);
                //if (level == 2)
                //    bufferGraphics.drawImage(pics[1], 150, 50, this);
                //if (level == 3)
                //    bufferGraphics.drawImage(pics[2], 150, 50, this);
                //if (level == 4)
                //    bufferGraphics.drawImage(pics[3], 150, 50, this);
                //if (level == 5)
                //    bufferGraphics.drawImage(pics[4], 150, 50, this);
                //if (level == 6)
                //    bufferGraphics.drawImage(pics[5], 150, 50, this);
                //if (level == 7)
                //    bufferGraphics.drawImage(pics[6], 150, 50, this);
                //if (level == 8)
                //    bufferGraphics.drawImage(pics[7], 150, 50, this);
                //if (level == 9)
                //    bufferGraphics.drawImage(pics[8], 150, 50, this);
                //if (level > 9)
                //    bufferGraphics.drawImage(pics[9], 150, 50, this);

                Color c = Color.FromArgb(255, (byte)rand.Next(256), (byte)rand.Next(256), (byte)rand.Next(256));


                for (int i = 0; i < 4; i++)
                {
                    for (int j = 0; j < 7; j++)
                    {
                        if (nextPieceMatrix[i][j] == 1)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Blue,Colors.White);
                        }
                        if (nextPieceMatrix[i][j] == 2)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Orange, Colors.White);
                        }
                        if (nextPieceMatrix[i][j] == 3)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Purple, Colors.White);
                        }
                        if (nextPieceMatrix[i][j] == 4)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Red, Colors.White);
                        }
                        if (nextPieceMatrix[i][j] == 5)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Cyan, Colors.White);
                        }
                        if (nextPieceMatrix[i][j] == 6)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Green, Colors.White);
                        }
                        if (nextPieceMatrix[i][j] == 7)
                        {
                            addBlock(-30 + (20 * j), 80 + (20 * i), Colors.Yellow, Colors.White);
                        }
                    }
                }

                for (int i = 0; i < 20; i++)
                {
                    for (int j = 0; j < 10; j++)
                    {
                        if (gameMatrixBuffer[i][j] == 1)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Colors.White);
                        }
                        if (gameMatrixBuffer[i][j] == 2)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Orange, Colors.White);
                        }
                        if (gameMatrixBuffer[i][j] == 3)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Purple, Colors.White);
                        }
                        if (gameMatrixBuffer[i][j] == 4)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Red, Colors.White);
                        }
                        if (gameMatrixBuffer[i][j] == 5)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Cyan, Colors.White);
                        }
                        if (gameMatrixBuffer[i][j] == 6)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Green, Colors.White);
                        }
                        if (gameMatrixBuffer[i][j] == 7)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Yellow, Colors.White);
                        }
                        //for clearing purposes
                        if (gameMatrix[i][j] == 8)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), c, Color.FromArgb(0,0,0,0));
                        }
                        if (gameMatrix[i][j] == 1)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Blue, Color.FromArgb(0, 0, 0, 0));
                        }
                        if (gameMatrix[i][j] == 2)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Orange, Color.FromArgb(0, 0, 0, 0));
                        }
                        if (gameMatrix[i][j] == 3)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Purple, Color.FromArgb(0, 0, 0, 0));
                        }
                        if (gameMatrix[i][j] == 4)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Red, Color.FromArgb(0, 0, 0, 0));
                        }
                        if (gameMatrix[i][j] == 5)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Cyan, Color.FromArgb(0, 0, 0, 0));
                        }
                        if (gameMatrix[i][j] == 6)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Green, Color.FromArgb(0, 0, 0, 0));
                        }
                        if (gameMatrix[i][j] == 7)
                        {
                            addBlock(150 + (20 * j), 50 + (20 * i), Colors.Yellow, Color.FromArgb(0, 0, 0, 0));
                        }

                    }
                }
            }

        }

        public void addBlock(int x, int y, Color c, Color border)
        {
            Border b = new Border();
            b.Width = 20;
            b.Height = 20;
            b.BorderBrush = new SolidColorBrush(border);
            b.BorderThickness = new Thickness(1);
            b.Opacity = 0.8;
            LinearGradientBrush grad = new LinearGradientBrush();
            grad.StartPoint = new Point(0.5, 0); 
            grad.EndPoint = new Point(0.5, 1);
            GradientStop stop1 = new GradientStop();
            stop1.Color = Colors.Black;
            GradientStop stop2 = new GradientStop();
            stop2.Color = c;
            stop2.Offset = 1;
            grad.GradientStops.Add(stop1);
            grad.GradientStops.Add(stop2);
            b.Background = grad;
            b.SetValue(Canvas.LeftProperty, (double)x);
            b.SetValue(Canvas.TopProperty, (double)y);
            //TetrisBlock block = new TetrisBlock(c, border);
            //block.SetValue(Canvas.LeftProperty, (double)x);
            //block.SetValue(Canvas.TopProperty, (double)y);
            mainCanvas.Children.Add(b);
        }

        private void clearCanvas()
        {
            while (mainCanvas.Children.Count > 0)
                mainCanvas.Children.RemoveAt(0);
        }
    }
}
