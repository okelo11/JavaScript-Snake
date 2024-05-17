const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const mapXSize = 20;
const mapYSize = 20;
let dir = null;
let grids = [];
let tails = [];
var gameInterval;
let addNewFood = false;
let canMoveUp = true;
let canMoveDown = true;
let canMoveLeft = true;
let canMoveRight = true;

document.onkeydown = (e) => {
    if (e.code == "ArrowUp" && canMoveUp) {
        if (dir == "ArrowDown")
            return;
        dir = e.code;
    } else if (e.code == "ArrowDown" && canMoveDown) {
        if (dir == "ArrowUp")
            return
        dir = e.code;


    } if (e.code == "ArrowRight" && canMoveRight) {
        if (dir == "ArrowLeft")
            return
        dir = e.code;

    } else if (e.code == "ArrowLeft" && canMoveLeft) {
        if (dir == "ArrowRight")
            return
        dir = e.code;

    }
}

player = {
    
    "currentGrid": null,
    "oldGrid": null
}
food = {
    "currentGrid": null
}
class Grid {//grids for map
    constructor(posX, posY, index) {
        this.positionX = posX
        this.positionY = posY
        this.index = index
        this.border = [];
    }

}
render = () => {

    ctx.fillStyle = "lightgreen"//backgroudn
    ctx.fillRect(0, 0, 600, 600)
    for (let y = 0; y < 20; y++) {//grids
        for (let x = 0; x < 20; x++) {
            ctx.fillStyle = "red"
            ctx.fillRect(x * 30, y * 30, 29, 29)
        }
    }
    ctx.fillStyle = "black"
    ctx.fillRect(player.currentGrid.positionX, player.currentGrid.positionY, 24, 24)//player
    if (tails.length > 0) {
        tails.forEach(tail => {
            ctx.fillStyle = "black"
            ctx.fillRect(tail.currentGrid.positionX, tail.currentGrid.positionY, 24, 24)
        });
    }

    ctx.fillStyle = "gold"//food
    ctx.fillRect(food.currentGrid.positionX, food.currentGrid.positionY, 24, 24)

    ctx.font = "25px Georgia";
    ctx.fillStyle = "rgb(0, 255, 0)"
    ctx.fillText("score: " + tails.length, 7, 20);

}
update = () => {
    if (dir != null) {//PlayerMove
        if (dir == "ArrowUp") {
            canMoveUp = false;
            canMoveDown = false;
            canMoveRight = true;
            canMoveLeft = true;
            player.oldGrid = player.currentGrid
            if (player.oldGrid.border.includes("up")) {
                if (typeof grids[player.currentGrid.index - mapXSize] != "undefined") {
                    player.currentGrid = grids[player.currentGrid.index - mapXSize]

                } else {
                    const goTo = (20 * 19);//width*(height-1) for index
                    player.currentGrid = grids[player.currentGrid.index + goTo]
                }


            } else {
                player.currentGrid = grids[player.currentGrid.index - mapXSize]

            }



        } else if (dir == "ArrowDown") {
            canMoveUp = false;
            canMoveDown = false;
            canMoveRight = true;
            canMoveLeft = true;

            player.oldGrid = player.currentGrid
            if (player.oldGrid.border.includes("down")) {
                if (typeof grids[player.currentGrid.index + mapXSize] != "undefined") {
                    player.currentGrid = grids[player.currentGrid.index + mapXSize]

                } else {
                    const goTo = (20 * 19);//width*(height-1) for index
                    player.currentGrid = grids[player.currentGrid.index - goTo]
                }


            } else {
                player.currentGrid = grids[player.currentGrid.index + mapXSize]

            }



        } else if (dir == "ArrowRight") {

            canMoveUp = true;
            canMoveDown = true;
            canMoveRight = false;
            canMoveLeft = false;
            player.oldGrid = player.currentGrid
            if (player.oldGrid.border.includes("right")) {
                if (typeof grids[player.currentGrid.index + 1] == "undefined" || grids[player.currentGrid.index + 1].border) {
                    player.currentGrid = grids[player.currentGrid.index - (mapXSize - 1)]

                } else {
                    player.currentGrid = grids[player.currentGrid.index + 1]

                }


            } else {
                player.currentGrid = grids[player.currentGrid.index + 1]
            }



        } else if (dir == "ArrowLeft") {
            canMoveUp = true;
            canMoveDown = true;
            canMoveRight = false;
            canMoveLeft = false;


            player.oldGrid = player.currentGrid
            if (player.oldGrid.border.includes("left")) {
                if (typeof grids[player.currentGrid.index + 1] == "undefined" || grids[player.currentGrid.index + 1].border) {
                    player.currentGrid = grids[player.currentGrid.index + (mapXSize - 1)]

                } else {
                    player.currentGrid = grids[player.currentGrid.index - 1]

                }


            } else {
                player.currentGrid = grids[player.currentGrid.index - 1]
            }

        }//PlayerMove


        if (player.currentGrid == food.currentGrid) {//EatFood and add new Tail
            tails.push({ "currentGrid": null, "oldGrid": null, "index": tails.length })
            addNewFood = true;

        }

        if (tails.length > 0) {//Tail Move
            tails.forEach(tail => {
                if (tail.index == 0) {
                    tail.oldGrid = tail.currentGrid;
                    tail.currentGrid = player.oldGrid;

                } else {
                    tail.oldGrid = tail.currentGrid;
                    tail.currentGrid = tails[tail.index - 1].oldGrid;
                }

            });
        }//TailMove
        if (addNewFood) {
            let newPosForFood;
            let con = true;
            while (con) {
                con = false;
                newPosForFood = Math.floor(Math.random() * 400);
                tails.forEach(element => {
                    if (element.currentGrid == grids[newPosForFood] || player.currentGrid == grids[newPosForFood]) {//fix this player check for just one time
                        con = true;
                    }
                });



            }


            food.currentGrid = grids[newPosForFood]
            addNewFood = false;
        }
        //newFood

        if (tails.length > 0) {
            tails.forEach(element => {
                if (element.currentGrid == player.currentGrid) {
                    console.log("over!")
                    clearInterval(gameInterval)
                    gameInitOneShot();

                }

            });
        }

    }

}
game = () => {
    update();
    render();
}


gameInitOneShot = () => {

    dir = null;//reset value for new game
    grids = [];//reset value for new game
    tails = [];//reset value for new game

    canMoveUp = true;//reset value for new game
    canMoveDown = true;//reset value for new game
    canMoveLeft = true;//reset value for new game
    canMoveRight = true;//reset value for new game
    addNewFood = false;//reset value for new game
    ctx.font = "20px Georgia";
    ctx.fillText("Score!", 0, 0)

    ctx.fillStyle = "lightgreen"//backgroudn
    ctx.fillRect(0, 0, 600, 600)
    for (let y = 0; y < 20; y++) {//grids
        for (let x = 0; x < 20; x++) {
            ctx.fillStyle = "red"
            ctx.fillRect(x * 30, y * 30, 29, 29)
            let newOne = new Grid(x * 30 + 2.5, y * 30 + 2.5, grids.length)
            if (x == 0) {
                newOne.border.push("left")
            } if (y == 0) {
                newOne.border.push("up")

            } if (x == 19) {
                newOne.border.push("right")
            } if (y == 19) {
                newOne.border.push("down")
            }
            grids.push(newOne)

        }

    }
    ctx.fillStyle = "black"
    player.currentGrid = grids[250];
    ctx.fillRect(player.currentGrid.positionX, player.currentGrid.positionY, 24, 24)//player
    food.currentGrid = grids[Math.floor(Math.random() * 400)];
    gameInterval = setInterval(() => {
        game();
    }, 1000 / 20);


}
gameInitOneShot();

