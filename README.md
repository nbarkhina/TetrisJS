# Tetris JS
[![Build status](https://neilb.visualstudio.com/Git%20Neil/_apis/build/status/Tetris%20JS%20CI)](https://neilb.visualstudio.com/Git%20Neil/_build/latest?definitionId=5)

This is the classic game of Tetris written in pure HTML (No Canvas 2D Controls). It simply uses HTML Tables and jQuery for rendering, and is surprisingly pretty fast. I know there's a lot of these out on the web but I wanted to create something that looked minimalistic yet elegant with excellent controls and compatibility.

See demo here: https://www.neilb.net/tetrisjs/

Wide browser support on both desktop and mobile devices. It is fully responsive and on larger screens it shows more information like the next piece. I spent quite a bit of time tweaking the touch controls to make it feel smooth and responsive on any smartphone. I used the following styles to extend the touch surface to the entire screen:

```css
body, html {
    height: 100%;
}
```

The code is written in TypeScript, to run and compile it locally use the following commands:

`npm install`

`tsc`

Please let me know of any feedback or bugs you may find.

Thanks!