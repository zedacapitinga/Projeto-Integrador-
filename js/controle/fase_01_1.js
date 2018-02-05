var Fase_01 = function () {
    Calciumtrice.call(this);
};
Fase_01.prototype = Object.create(Calciumtrice.prototype);

Fase_01.prototype.create = function () {
    //aqui seta no banco a fase em que o jogador parou
    this.setFase('fase_01');
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.mapaGlobal = new TileMap(this.game, 'mapaVariosInimigos');
    this.mapaGlobal.outOfBoundsKill = true;
    this.mapaGlobal.checkWorldBounds = true;
    this.mapaGlobal.addTilesetImage('grassland', 'grassLandTileset');
    this.layerChao = this.mapaGlobal.createLayer('chao');
    this.layerChaoVisivel = this.mapaGlobal.createLayer('chao');
    this.layerChaoVisivel.alpha = 0.8;
    this.layerParede = this.mapaGlobal.createLayer('paredes');
    this.layerChao.resizeWorld();
    this.mapaGlobal.setCollisionBetween(1, 1000, true, 'paredes');

//    this.saida = this.mapaGlobal.createFromObject('objetos', 163, 'doom_porta');
//    this.game.physics.arcade.enable(this.saida);
//    this.saida.enableBody = true;
    
    this.inimigos = this.game.add.group();
    this.criaInimigo(this.inimigos, this.mapaGlobal.layer.data);   

    this.jogador = this.mapaGlobal.createFromObject('objetos', 9, 'heroi', 0, true, true, Jogador);
    this.jogador.cria(this.layerParede, this.inimigos);
    this.criaHud();
    this.setAlvoDosInimigos(this.jogador.shadow, this.inimigos);    
    this.aplicaMascara(this.jogador.luz, [this.layerChao, this.inimigos]);
    this.jogador.setHud(this.tirosJogador, this.vidaJogador);    
    
    Calciumtrice.game.input.mouse.capture = true;
};

Fase_01.prototype.passaFase = function () {
    this.game.state.start('fase_02');
};

Fase_01.prototype.update = function () {
    if (this.jogador.vida < 1) {
        this.fimDeJogo();
    }
    
    
    this.hud.frame = this.jogador.numTiros;
    
    this.game.physics.arcade.collide(this.jogador.shadow, this.layerParede);
//    this.game.physics.arcade.collide(this.jogador.shadow, this.saida, this.passaFase, null, this);
    this.game.physics.arcade.collide(this.inimigos.shadow, this.layerParede);
    this.game.physics.arcade.collide(this.jogador.shadow, this.inimigos.shadow);

    this.inimigos.sort('y', Phaser.Group.SORT_ASCENDING);
	
    //-----------------------------------
    
    if(this.inimigos.length == 0){
        this.criaInimigo(this.inimigos, this.mapaGlobal.layer.data);
        this.setAlvoDosInimigos(this.jogador.shadow, this.inimigos);
        this.aplicaMascara(this.jogador.luz, [this.layerChao, this.inimigos]);
    }
};

Fase_01.prototype.render = function () {
    Calciumtrice.game.debug.text(Calciumtrice.game.time.fps || '--', 2, 14, "#ff0000");
};

//Fase_01.prototype.criaLayersTelhados = function () {
//    var layersTelhados = [];
//    return layersTelhados;
//};
