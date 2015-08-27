var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});

var map;
var layer;
var cursors;
var sprite;
var timer; 
var inimigos;
var mapaAtual;
var enemySpeed = 90;

var easystar = new EasyStar.js();

function preload(){
    game.load.image('tiles', 'assets/tmw_desert_spacing.png');
    game.load.image('car', 'assets/car90.png' );
    game.load.tilemap('simple','assets/simple.json', null, Phaser.Tilemap.TILED_JSON);
}

function create(){    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    map = game.add.tilemap('simple');
    
    map.addTilesetImage('Simple', 'tiles');
    
    layer = map.createLayer('Ground');
    
    layer.resizeWorld();
    
    personagem = game.add.sprite(160, 64, 'car');
    game.physics.enable(personagem);
    personagem.body.collideWorldBounds = true;
	personagem.body.immovable = true;
    personagem.anchor.setTo(0, 0);
    
    inimigos = game.add.group();

    game.camera.follow(personagem);
    
    cursors = game.input.keyboard.createCursorKeys();
        
    mapaAtual = convert((map.layer).data);
    
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);    
    
    easystar.setGrid(mapaAtual);
    
    easystar.setAcceptableTiles([30]); 
    
    easystar.enableDiagonals(); 
    
//    criaInimigo(0, 0);
//    criaInimigo(0, 32);
    criaInimigo(0, 64);
    criaInimigo(0, 96);

	easystar.calculate();	
	
    game.physics.arcade.collide(personagem, inimigos);
    game.physics.arcade.collide(personagem, layer);
	
	iniciaPath();
    
}

function update(){         
    if (cursors.left.isDown){
        personagem.x -= 5;
    }
    
    if (cursors.right.isDown){
        personagem.x += 5;  
    }
    
    if (cursors.down.isDown){
        personagem.y += 5;
    }
    
    if (cursors.up.isDown){
        personagem.y -= 5;
    }	
	
	for(var i = 0; i < inimigos.children.length; i++){
		move(inimigos.children[i]);
	}
}

function criaInimigo(_x, _y){
    var inimigo;

    inimigo = game.add.sprite(_x, _y, 'car');
    inimigo.anchor.setTo(0, 0);
    inimigo.direcao = "W";

    game.physics.enable(inimigo);
    inimigo.enableBody = true;
	inimigo.body.collideWorldBounds = true;
    
    inimigos.add(inimigo);
}


function convert(_obj){
    var elemento = [];
    for(var i = 0; i < _obj.length; i++){
        
        elemento[i] = [];
        for(var j = 0; j < _obj[i].length; j++){
            elemento[i][j] = (_obj[i][j]).index;
        }
    }
    return elemento;
}

function iniciaPath(){
	setInterval(function(){
		for(var i = 0; i < inimigos.children.length - 1; i++){
			
		var currentPlayerX = layer.getTileX(personagem.x);
		var currentPlayerY = layer.getTileX(personagem.y);
			
			easystar.findPath(layer.getTileX(inimigos.children[i].x), layer.getTileX(inimigos.children[i].y), currentPlayerX, currentPlayerY, function( path ) {

				if (path) {
					currentNextPointX = path[1].x;
					currentNextPointY = path[1].y;
				}

				if (currentNextPointX < currentPlayerX && currentNextPointY < currentPlayerY){
					// left up
					inimigos.children[i].direcao = "NW";

				}else if (currentNextPointX == currentPlayerX && currentNextPointY < currentPlayerY){
					// up
					inimigos.children[i].direcao = "N";

				}else if (currentNextPointX > currentPlayerX && currentNextPointY < currentPlayerY){
					// right up
					inimigos.children[i].direcao = "NE";

				}else if (currentNextPointX < currentPlayerX && currentNextPointY ==currentPlayerY){
					// left
					inimigos.children[i].direcao = "W";

				}else if (currentNextPointX > currentPlayerX && currentNextPointY ==currentPlayerY){
					// right
					inimigos.children[i].direcao = "E";

				}else if (currentNextPointX > currentPlayerX && currentNextPointY > currentPlayerY){
					// right down
					inimigos.children[i].direcao = "SE";

				}else if (currentNextPointX == currentPlayerX && currentNextPointY > currentPlayerY){
					// down
					inimigos.children[i].direcao = "S";

				}else if (currentNextPointX < currentPlayerX && currentNextPointY > currentPlayerY){
					// left down
					inimigos.children[i].direcao = "SW";

				}else{
					inimigos.children[i].direcao = "STOP";
				}
			});
		}

		easystar.calculate();
	}, 400);
}

function move(_inimigo){
	if (_inimigo.direcao == "N"){
		_inimigo.body.velocity.x = -enemySpeed;
		_inimigo.body.velocity.y = -enemySpeed;
	}else if (_inimigo.direcao == "S"){
		_inimigo.body.velocity.x = enemySpeed;
		_inimigo.body.velocity.y = enemySpeed;
	}else if (_inimigo.direcao == "E"){
		_inimigo.body.velocity.x = enemySpeed;
		_inimigo.body.velocity.y = -enemySpeed;
	}else if (_inimigo.direcao == "W"){
		_inimigo.body.velocity.x = -enemySpeed;
		_inimigo.body.velocity.y = enemySpeed;
	}else if (_inimigo.direcao == "SE"){
		_inimigo.body.velocity.x = enemySpeed;
		_inimigo.body.velocity.y = 0;
	}else if (_inimigo.direcao == "NW"){
		_inimigo.body.velocity.x = -enemySpeed;
		_inimigo.body.velocity.y = 0;   	
	}else if (_inimigo.direcao == "SW"){
		_inimigo.body.velocity.x = 0;
		_inimigo.body.velocity.y = enemySpeed;    	
	}else if (_inimigo.direcao == "NE"){
		_inimigo.body.velocity.x = 0;
		_inimigo.body.velocity.y = -enemySpeed;
	}else{
		_inimigo.body.velocity.x = 0;
		_inimigo.body.velocity.y = 0;
	}
}