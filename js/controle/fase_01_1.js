var Fase_01 = function () {
//    Calciumtrice.call(this);
};
Fase_01.prototype = Object.create(Calciumtrice.prototype);

Fase_01.prototype.constructor = Fase_01;

Fase_01.prototype.create = function () {
    //aqui seta no banco a fase em que o jogador parou
    this.setFase('fase_01');
    this.tempoJogadorVivo = this.game.time.now;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	
    this.mapaGlobal = new TileMap(this.game, 'mapaVariosInimigos');
    this.mapaGlobal.outOfBoundsKill = true;
    this.mapaGlobal.checkWorldBounds = true;
    this.mapaGlobal.addTilesetImage('grassland', 'grassLandTileset');
    this.layerChao = this.mapaGlobal.createLayer('chao');
    this.layerChao.renderSettings.enableScrollDelta = false;
    this.layerChaoVisivel = this.mapaGlobal.createLayer('chao');
    this.layerChaoVisivel.renderSettings.enableScrollDelta = false;
    this.layerChaoVisivel.alpha = 0.8;
    this.layerParede = this.mapaGlobal.createLayer('paredes');
    this.layerParede.renderSettings.enableScrollDelta = false;
    this.layerChao.resizeWorld();
    this.mapaGlobal.setCollisionBetween(1, 1000, true, 'paredes');
    
    this.criaEasyStar(this.mapaGlobal.layer.data, [7, 1]);
//    this.saida = this.mapaGlobal.createFromObject('objetos', 163, 'doom_porta');
//    this.game.physics.arcade.enable(this.saida);
//    this.saida.enableBody = true;
    
    this.inimigos = this.game.add.group();
    this.criaInimigo(this.inimigos, this.mapaGlobal.layer.data);   
    
    this.jogador = this.mapaGlobal.createFromObject('objetos', 9, 'heroi', 0, true, true, Jogador);
    this.jogador.cria(this.layerParede, this.inimigos);
    this.criaHud();
    this.setAlvoDosInimigos(this.jogador.shadow, this.inimigos);
    this.jogador.setHud(this.tirosJogador, this.vidaJogador, this.hud);
    this.aplicaMascara(this.jogador.luz, [this.layerChao, this.inimigos]);
//    this.listaInimigos = this.inimigos.iterate("tipo", "ini", Phaser.Group.RETURN_ALL);
//    console.log(this.listaArray);
//    this.inimigos.add(this.jogador);
    //nessa função eu rodo o grupo pertuntando pelo tipo e quando ele acha eu mando o callback
//    this.listaArray = this.inimigos.iterate("tipo", "ini", null, callbackfunction);
//    this.hudTemp = this.game.add.text(30, 100, this.inimigos.length, 
//                                      {font: "24px Arial", fill: "#e82d00", align: "center"});
//    this.hudTemp.fixedToCamera = true;
    Calciumtrice.game.input.mouse.capture = true;
    
       
    var self = this;
    this.inimigos.forEach(function(inimigo){
        if(inimigo.alive){
            var xInimigo = self.layerChaoVisivel.getTileX(inimigo.shadow.position.x);
            var yInimigo = self.layerChaoVisivel.getTileY(inimigo.shadow.position.y);
            var xHeroi = self.layerChaoVisivel.getTileX(self.jogador.position.x);
            var yHeroi = self.layerChaoVisivel.getTileY(self.jogador.position.y);
            self.easyStar.findPath(xInimigo, yInimigo, xHeroi, yHeroi, function(path){
                inimigo.setPath(path);
            });
        }
    });
    
    
//    var self = this;
//	this.inimigos.forEach(function(inimigo){
//        if(inimigo.alive){
//            var xInimigo = self.layerChaoVisivel.getTileX(inimigo.shadow.position.x);
//            var yInimigo = self.layerChaoVisivel.getTileY(inimigo.shadow.position.y);
//            var xHeroi = self.layerChaoVisivel.getTileX(self.jogador.position.x);
//            var yHeroi = self.layerChaoVisivel.getTileY(self.jogador.position.y);
//            self.easyStar.findPath(xInimigo, yInimigo, xHeroi, yHeroi, function (path) {
//                var path = _path;
//                self.game.time.events.repeat(Phaser.Timer.SECOND, path.length, inimigo.pathFinded(path), this);
//                inimigo.pathLista = path;
//                self.game.time.events.add(1000 , inimigo.pathFinded(path), this);
//                inimigo.pathFinded(path);   // 220
//            });
//            self.easyStar.calculate();
//        }
//		self.game.time.events.repeat(Phaser.Timer.SECOND, inimigo.pathLista.length, inimigo.pathFinded(), this);
//	});
    
    //Da pra otimizar o pathfinder fazendo ele percorrer o 'path' todo, até o jogador trocar de posicao.
    //No momento ele nao está otimizado e usa o update pra correr o 'path'
    //Fazer um evento de tempo pra percorrer o 'for' talvez.
    
    
};

Fase_01.prototype.update = function () {
    if (this.jogador.vida < 1) {this.fimDeJogo(this.tempoJogadorVivo)}
    
//    this.game.world.bringToTop(this.jogador);
    
    this.easyStar.calculate();
    this.game.physics.arcade.collide(this.jogador.shadow, this.layerParede);
//    this.game.physics.arcade.collide(this.inimigos.shadow, this.layerParede);
//    this.game.physics.arcade.collide(this.jogador.shadow, this.inimigos.shadow);
//    this.game.physics.arcade.collide(this.jogador.shadow, this.saida, this.passaFase, null, this);

    this.inimigos.sort('y', Phaser.Group.SORT_ASCENDING);
	
    //-----------------------------------
    
    if(this.inimigos.length == 0){
        
        this.criaInimigo(this.inimigos, this.mapaGlobal.layer.data);
        this.setAlvoDosInimigos(this.jogador.shadow, this.inimigos);
        this.aplicaMascara(this.jogador.luz, [this.layerChao, this.inimigos]);
        this.procuraHero();
        
              
    }
    
};

Fase_01.prototype.render = function () {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#ff0000");
    this.game.debug.text(this.inimigos.length || '--', 2, 24, "#ff0000");
//    Calciumtrice.game.debug.text(this.easyStar.instances.length || '--', 2, 14, "#ff0000");
    
};

Fase_01.prototype.procuraHero = function(){
   var self = this;
    this.inimigos.forEach(function(inimigo){
        if(inimigo.alive){
            var xInimigo = self.layerChaoVisivel.getTileX(inimigo.shadow.position.x);
            var yInimigo = self.layerChaoVisivel.getTileY(inimigo.shadow.position.y);
            var xHeroi = self.layerChaoVisivel.getTileX(self.jogador.position.x);
            var yHeroi = self.layerChaoVisivel.getTileY(self.jogador.position.y);
            self.easyStar.findPath(xInimigo, yInimigo, xHeroi, yHeroi, function(path){
//                inimigo.pathLista = path;
//                inimigo.pathFinded(path);
                inimigo.setPath(path);
//                inimigo.pathFinded(path);
            });
//            self.easyStar.calculate();
//            inimigo.vaiAndar();
        }
    });  
};

Fase_01.prototype.passaFase = function () {
    this.game.state.start('fase_02');
};

//Fase_01.prototype.criaLayersTelhados = function () {
//    var layersTelhados = [];
//    return layersTelhados;
//};
