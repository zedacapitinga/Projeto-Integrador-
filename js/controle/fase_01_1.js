var Fase_01 = function () {
//    Calciumtrice.call(this);
};
Fase_01.prototype = Object.create(Calciumtrice.prototype);

Fase_01.prototype.constructor = Fase_01;

Fase_01.prototype.create = function () {
    this.setFase('fase_01');
//    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	
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
    this.inimigoCadavereGrupo = this.game.add.group();
    this.inimigos = this.game.add.group();
    this.criaInimigo(this.inimigos, this.mapaGlobal.layer.data, this.inimigoCadavereGrupo);   
    
    this.jogadorIni = this.mapaGlobal.createFromObject('objetos', 9, 'heroi', 0, true, true, Jogador);
    this.jogadorIni.cria(this.layerParede);
//    this.grupoNovo = this.game.add.group();
//    this.grupoNovo.add(this.jogadorIni);
    this.inimigos.add(this.jogadorIni);
//    this.criaHud();
    //vai ter que mudar o setAlvoDosInimigos rodar com iterate
    this.jogador = this.inimigos.iterate("tipo", "jog", Phaser.Group.RETURN_CHILD);
    
    this.setAlvoDosInimigos(this.jogador.shadow, this.inimigos);
//    this.jogador.setHud(this.tirosJogador, this.vidaJogador, this.hud);
    this.aplicaMascara(this.jogador.luz, [this.layerChao, this.inimigos]);
    this.inimigosLista = this.inimigos.iterate("tipo", "ini", Phaser.Group.RETURN_ALL);
    
    Calciumtrice.game.input.mouse.capture = true;    
    
//    var self = this;
//    this.inimigos.iterate("tipo", "ini", null, function(inimigo){
//        if(inimigo.alive){
//            var xInimigo = self.layerChaoVisivel.getTileX(inimigo.shadow.position.x);
//            var yInimigo = self.layerChaoVisivel.getTileY(inimigo.shadow.position.y);
//            var xHeroi = self.layerChaoVisivel.getTileX(self.jogador.position.x);
//            var yHeroi = self.layerChaoVisivel.getTileY(self.jogador.position.y);
//            self.easyStar.findPath(xInimigo, yInimigo, xHeroi, yHeroi, function(path){
//                inimigo.setPath(path);
//            });
//        }
//        
//    });    
    
//    var self = this;
//    this.inimigos.forEach(function(inimigo){
//        if(inimigo.alive){
//            var xInimigo = self.layerChaoVisivel.getTileX(inimigo.shadow.position.x);
//            var yInimigo = self.layerChaoVisivel.getTileY(inimigo.shadow.position.y);
//            var xHeroi = self.layerChaoVisivel.getTileX(self.jogador.position.x);
//            var yHeroi = self.layerChaoVisivel.getTileY(self.jogador.position.y);
//            self.easyStar.findPath(xInimigo, yInimigo, xHeroi, yHeroi, function(path){
//                inimigo.setPath(path);
//            });
//        }
//    });
//            
//        this.procuraHero();
    this.tempoProximoProcuraHero = 0;
    
};

Fase_01.prototype.update = function () {
    var faseZeroUm = this;
    if (this.jogador.vida < 1) {
        this.fimDeJogo()
    }    
//    this.game.world.bringToTop(this.jogador);    
    this.game.physics.arcade.collide(this.jogador.shadow, this.layerParede);
//    this.game.physics.arcade.collide(this.inimigos.shadow, this.layerParede);
//    this.game.physics.arcade.collide(this.jogador.shadow, this.inimigos.shadow);
//    this.game.physics.arcade.collide(this.jogador.shadow, this.saida, this.passaFase, null, this);
    this.game.physics.arcade.overlap(this.jogadorss, this.inimigosLista, function (_jogador, _inimigo) {
        _jogador.recebeAtaque(_inimigo);
    });
    
    if(this.jogador.tiros.getFirstAlive()){
        var _bala = this.jogador.tiros.getFirstAlive();
        this.game.physics.arcade.collide(_bala, this.inimigos, function (_Bala, _inimigo) {
            faseZeroUm.jogador.mataBala(_Bala, _inimigo);
        });                                       
        this.game.physics.arcade.collide(_bala, this.layerParede, function (_Bala, _parede) {
            faseZeroUm.jogador.mataBalaParede(_Bala, _parede);
        });
    }
    
    this.easyStar.calculate();
    if(this.game.time.now > this.tempoProximoProcuraHero){        
        this.procuraHero();
        this.tempoProximoProcuraHero = this.game.time.now + 1000;        
    }
    if(this.inimigos.length == 1){        
        this.criaInimigo(this.inimigos, this.mapaGlobal.layer.data, this.inimigoCadavereGrupo);
        this.setAlvoDosInimigos(this.jogador.shadow, this.inimigos);
        this.aplicaMascara(this.jogador.luz, [this.layerChao, this.inimigos]);
        this.procuraHero();
    }    
    this.inimigos.sort('y', Phaser.Group.SORT_ASCENDING);	
};

Fase_01.prototype.render = function () {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#ff0000");
    Calciumtrice.game.debug.text(Calciumtrice.game.time.fps || '--', 2, 14, "#ff0000");
    this.game.debug.text(this.inimigos.length || '--', 2, 30, "#ff0000");
//    Calciumtrice.game.debug.text(this.easyStar.instances.length || '--', 2, 14, "#ff0000");
    
};

Fase_01.prototype.procuraHero = function(){
   var self = this;
    this.inimigos.iterate("tipo", "ini", null, function(inimigo){
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
};

Fase_01.prototype.passaFase = function () {
    this.game.state.start('fase_02');
};

//Fase_01.prototype.criaLayersTelhados = function () {
//    var layersTelhados = [];
//    return layersTelhados;
//};
