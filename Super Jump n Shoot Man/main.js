var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var LAYER_OBJECT_TRIGGERS = 3;
var LAYER_OBJECT_ENEMIES = 4;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
var TILE = 35;
var TILESET_TILE = TILE * 2;
var MAP = {tw: 60, th: 15};

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var score = 0;

var lives = 3;

var time = 60;

var worldOffsetX = 0;

var METER = TILE; //abitrary choice for 1m

var GRAVITY = METER * 9.8 * 3;  //very exaggerated gravity (6x)

var MAXDX = METER * 10; // max horizontal speed ( 10 tiles per second)

var MAXDY = METER * 15; // max vertical speed ( 15 tiles per second)

var ACCEL = MAXDX * 2; //horizontal acceleration - take 1/2 second to reach maxdx

var FRICTION = MAXDX * 6; //horizontal friction - take 1/6 second to stop from maxdx

var JUMP = METER * 1500; // a large instantaneous jump impulse

var enemies = [];


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var tileset = document.createElement("img");
tileset.src = "tileset.png";

var heart = document.createElement("img");
heart.src = "heart.png";

var player = new Player();
var keyboard = new Keyboard();

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_WINGAME = 3;

var gameState = STATE_SPLASH;

var splashTimer = 3;

switch(gameState)
{
	case STATE_SPLASH: 		//process the splash screen
		break;
	case STATE_GAME: 		//process the game state
		break;
	case STATE_GAMEOVER: 	//process the gameover state
		break;
	case STATE_WINGAME: 	//process the wingame state
		break;
}

var music = new Howl(
{
	urls: ["background.ogg"],
	loop: true,
	buffer: true,
	volume: 0.1
} );
<<<<<<< HEAD
=======
//music.play();
>>>>>>> origin/master

var sfx = new Howl(
{
	urls: ["jumppp11.ogg"],
	buffer: true,
	volume: 1,
	loop: false
} );

var cells =[];

function initialize()
{
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level2.layers[layerIdx].height; y++)
		{
			cells[layerIdx][y] = [];
			for(var x = 0; x < level2.layers[layerIdx].width; x++)
			{
				if(level2.layers[layerIdx].data[idx] !=0)
				{
					/*
						for each tile we find in the layer data, we need to create 4 collisions
						(becjause out collision squares are 35x35 but the tile in the level
						are 70x70)
					*/
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] !=1)
				{
					cells[layerIdx][y][x] = 0; 	//if the value of the cell isnt set. set it to 0 now.
				}
				idx++;
			}
		}
	}

	//initialize trigger layer in collision map.
	cells[LAYER_OBJECT_TRIGGERS] = [];
	idx = 0;
	for(var y = 0; y < level2.layers[LAYER_OBJECT_TRIGGERS].height; y++)
	{
		cells[LAYER_OBJECT_TRIGGERS][y] = [];
		for(var x = 0; x < level2.layers[LAYER_OBJECT_TRIGGERS].width; x++)
		{
			if(level2.layers[LAYER_OBJECT_TRIGGERS].data[idx] != 0)
			{
				cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;
			}
			else if(cells[LAYER_OBJECT_TRIGGERS][y][x] !=1)
			{
				cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;
			}
			idx++;
		}
	}
}
	idx = 0;
	for(var y = 0; y < level2.layers[LAYER_OBJECT_ENEMIES].height; y++)
		{
			for(var x = 0; x < level2.layers[LAYER_OBJECT_ENEMIES].width; x++)
			{
				if(level2.layers[LAYER_OBJECT_ENEMIES].data[idx] !=0)
				{
					var px = tileToPixel(x);
					var py = tileToPixel(y);
					var e = new Enemy(px, py);
					enemies.push(e);
				}
				idx++;
			}
		}

function cellAtPixelCoord(layer, x, y)
{
	if(x<0 || x>SCREEN_WIDTH)
		return 1;
	//let the player fall past the bottom on the screen
	//if so, player dies.
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if(tx<0 || tx>=MAP.tw)
		return 1;
	//let the player fall past the bottom of the screen
	//if so, player dies.
	if(ty>=MAP.th || ty < 0)
		return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
};

function drawMap()
{
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var tileX = pixelToTile(player.position.x);

console.log(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x%TILE);

	startX = tileX - Math.floor(maxTiles / 2);

	if(startX < -1)
	{
		startX = 0;
		offsetX = 0;
	}
	if(startX > MAP.tw - maxTiles)
	{
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}

	worldOffsetX = startX * TILE + offsetX;

	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
	{
		for(var y=0; y<level2.layers[layerIdx].height; y++)
		{
			var idx = y * level2.layers[layerIdx].width + startX;
			for(var x = startX; x < startX + maxTiles; x++)
			{
				if(level2.layers[layerIdx].data[idx] !=0)
				{
					/*
						the tiles in the Tiled map are base 1
						(meaning a value of 0 means no tile)
						so subtract one from the tileset if
						to get the correct tile
					*/
					var tileIndex = level2.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
					(TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * 
					(TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, 
									(x - startX) * TILE - offsetX, (y-1)*TILE,
									TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if(y2 + h2 < y1 || x2 + w2 < x1 ||
		x2 > x1 + w1 || y2 > y1 + h1)
	{
		return false;
	}
	return true;
}

function runSplash(deltaTime)
{
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		splashTimer = 3;
		player.isDead = false;
		//score = 0;
		time = 60;

		music.play();

		gameState = STATE_GAME;
		return;
	}

	context.fillStyle = "#000";
	context.font = "24px Arial";
	context.fillText("Super Awesome Platforming Adventure", 100, 240);
	context.fillText("STARTING IN " + splashTimer.toPrecision(3), 200, 350);
}

function runGame(deltaTime)
{
	player.update(deltaTime);

	drawMap();
	player.draw();

	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);

	//score - leaving the score code in here because i will add enemies to kill and increase the score.
	/*context.fillStyle = "yellow";
	context.font="32px Arial";
	var scoreText = "Score: " + score;
	context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
	*/

	//life counter
	for(var i=0; i<lives; i++)
	{
		context.drawImage(heart, 20 + ((heart.width+2)*1) + (i * 35), 10);
	}

	if(player.position.y > SCREEN_HEIGHT)
	{
		player.position.x = 2 * TILE;
		player.position.y = 5 * TILE;
		lives = lives -1;
	}

	if(lives == 0)
	{
		player.isDead = true;
		runGameOver(deltaTime);
		gameState = STATE_GAMEOVER;
	}

	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].update(deltaTime);

		if(player.isDead == false)
		{
			cells[LAYER_OBJECT_ENEMIES] = [];
			idx = 0;
			for(var y = 0; y < level2.layers[LAYER_OBJECT_ENEMIES].height; y++)
			{
				cells[LAYER_OBJECT_ENEMIES][y] = [];
				for(var x = 0; x < level2.layers[LAYER_OBJECT_ENEMIES].width; x++)
				{
					if(level2.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0)
					{
						cells[LAYER_OBJECT_ENEMIES][y][x] = 1;
						cells[LAYER_OBJECT_ENEMIES][y-1][x] = 1;
						cells[LAYER_OBJECT_ENEMIES][y-1][x+1] = 1;
						cells[LAYER_OBJECT_ENEMIES][y][x+1] = 1;
					}
					else if(cells[LAYER_OBJECT_ENEMIES][y][x] !=1)
					{
						cells[LAYER_OBJECT_ENEMIES][y][x] = 0;
					}
					idx++;
				}
			}
		}

		enemies[i].draw();
	}

	time -= deltaTime;

	context.fillStyle = "red";
	context.font="18px Arial";
	context.fillText("Time: " + time.toPrecision(3), 300, 20);

	if(time <= 0)
	{
		lives = 0;
		player.isDead = true;
		runGameOver(deltaTime);
		gameState = STATE_GAMEOVER;
	}
}

function runGameOver(deltaTime)
{
	context.fillStyle = "#FFFFFF";
	context.font = "24px Arial";
	context.fillStyle = "#FF0000";
	context.fillText("Game Over", 240, 240);
	context.fillStyle = "#FFFFFF";
	context.fillText("Your Score: " +score, 230, 280);

	sfx.stop();
}

function runWinGame(deltaTime)
{
	context.fillStyle = "#FFFFFF";
	context.font = "24px Arial";
	context.fillStyle = "green";
	context.fillText("You Win!", 200, 200);
	context.fillStyle = "#FFFFFF";
	//context.fillText("Your Score, " +score, 230, 280);
	context.fillText("Congrats, You Win!", 200, 300)
	context.fillStyle = "green";
	context.fillText("You Win!", 100, 100);
	context.fillStyle = "green";
	context.fillText("You Win!", 400, 138);
	context.fillStyle = "green";
	context.fillText("You Win!", 50, 150);
	context.fillStyle = "green";
	context.fillText("You Win!", 350, 100);
	context.fillStyle = "green";
	context.fillText("You Win!", 460, 350);
	context.fillStyle = "green";
	context.fillText("You Win!", 580, 230);

	sfx.stop();
}

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();

		//pass 1, 2, 3 for the layer of tiles that you want to be highlighted.
	//DrawLevelCollisionData(1);

	switch(gameState)
	{
		case STATE_SPLASH:
				runSplash(deltaTime);
				break;
		case STATE_GAME:
				runGame(deltaTime);
				break;
		case STATE_GAMEOVER:
				runGameOver(deltaTime);
				break;
		case STATE_WINGAME:
				runWinGame(deltaTime);
				break;
	}
}

initialize();


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
