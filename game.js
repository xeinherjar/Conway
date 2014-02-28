var ctx = document.getElementById('canvas').getContext('2d');

//Board size 400 x 400
//Blocks are 5x5
//So real size is 400/5, so 80x80 blocks
// 800x800 -- 800/5 = 160
var WIDTH  = 80;
var HEIGHT = 80;
var BOARD1  = [];
var BOARD2  = [];
var FPS = 30;
var GEN = 10;

var buildBoard = function(w, h) {
	for (var i = 0; i < w; i++) {
		BOARD1.push([]);
		BOARD2.push([]);
	}

	for (var i = 0; i < w; i++) {
		for(var j =0; j < h; j++) {
			BOARD1[i].push([]);
			BOARD2[i].push([]);
		}
	}
};

var randomTF = function() {
	return Math.random() >= 0.92;
};

var populate = function(w, h) {
	for (var i = 0; i < w; i++) {
		for(var j =0; j < h; j++) {
			var tmpBlock = new block(5*i, 5*j, randomTF());
			BOARD1[i][j] = tmpBlock;
		}
	}
};

var block = function(x, y, alive) {
	this.x = x;
	this.y = y;
	this.alive = alive || false;
};


var handleToUpdateInterval;

var init = function() {
	buildBoard(WIDTH, HEIGHT);
	populate(WIDTH, HEIGHT);
	handleToUpdateInterval = setInterval(update, 1000 / GEN);
	handleToDrawInterval = setInterval(drawBoard, 1000/ FPS);
};

var stop = function() {
	clearInterval(handleToUpdateInterval);
	clearInterval(handleToDrawInterval);
};


var draw = function(block) {
	ctx.beginPath();
	ctx.fillStyle = "rgb(200,0,0)";
	ctx.fillRect (block.x, block.y, 5, 5);
};

var drawBoard = function() {
	//Clear canvas for drawing!
	ctx.clearRect(0, 0, 800, 800);	
	for (var i = 0; i < WIDTH; i++) {
		for (var j =0; j < HEIGHT; j++) {
			if (BOARD1[i][j].alive) {
				draw(BOARD1[i][j]);
			} 
		}
	}
};

var getIndex = function(index, maxSize) {
	maxSize = maxSize - 1;
	if (index < 0) {
		return index + maxSize;
	} else if (index > maxSize) {
		return index % maxSize;
	} else {
		return index;
	}
};

var update = function() {
	//Update block state, alive or dead?

	//live :: < 2 live neighbors :: dies
	//live :: 2 or 3 live neighbors :: lives
	//live :: > 3 live neighbors :: dies
	//dead :: ==3 neighbors :: lives

	//Copy current state.
	//BOARD1 = BOARD2;
	var toTest;
	var nAlive = 0;
	var nDead = 0;

	for (var i = 0; i <= WIDTH - 1; i++) {
		for (var j = 0; j <= HEIGHT - 1; j++) {
			nAlive = 0;
			nDead = 0;

			toTest =   	[BOARD1[getIndex(i-1,HEIGHT)][getIndex(j-1,WIDTH)], BOARD1[getIndex(i-1,HEIGHT)][getIndex(j,WIDTH)],	BOARD1[getIndex(i-1,HEIGHT)][getIndex(j+1,WIDTH)],
						BOARD1[getIndex(i,HEIGHT)][getIndex(j-1,WIDTH)],														BOARD1[getIndex(i,HEIGHT)][getIndex(j+1,WIDTH)],
						BOARD1[getIndex(i+1,HEIGHT)][getIndex(j-1,WIDTH)], BOARD1[getIndex(i+1,HEIGHT)][getIndex(j,WIDTH)], 	BOARD1[getIndex(i+1,HEIGHT)][getIndex(j+1,WIDTH)]];
																		
			//console.log(toTest);

			for (var k = 0; k < toTest.length; k++) {
				if (toTest[k].alive === true) {
					nAlive += 1;
				} else {
					nDead += 1;
				}
			}

			BOARD2[i][j] = BOARD1[i][j];
			if (BOARD1[i][j].alive) {
				if (nAlive < 2) {
					BOARD2[i][j].alive = false;
				} else if (nAlive > 3) {  
					BOARD2[i][j].alive = false;
				} else {
					BOARD2[i][j].alive = true;
				}
			} else {
				if (nAlive === 3) {
					BOARD2[i][j].alive = true;
				}
			}
	 	
		}
	}

	//update board1 with board2 state for drawing
	var tmpBoard;
	tmpBoard = BOARD2;
	BOARD1 = tmpBoard;
	//drawBoard();
};




/*
 0 1 2 3 4
0[][][][][],
1[][][][][],
2[][][][][],
3[][][][][],
4[][][][][]
*/

