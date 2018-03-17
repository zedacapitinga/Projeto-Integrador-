var Calciumtrice = function () {
    this.game;
    this.somFase;

    this.easystar;

    this.jogador;
    this.inimigos;

    this.hud;
    this.vidaJogador;
    this.tirosJogador;
    this.somZumbi;
};

Calciumtrice.prototype = Object.create(Object.prototype);
Calciumtrice.prototype.constructor = Calciumtrice;

Calciumtrice.prototype.iniciaBanco = function (_fase) {
    if (!window.localStorage.getItem("fase")) {
        this.setFase(_fase);
    }
};

Calciumtrice.prototype.setFase = function (_fase) {
    window.localStorage.setItem("fase", _fase);
};

Calciumtrice.prototype.getFase = function () {
    return window.localStorage.getItem("fase");
};

Calciumtrice.prototype.criaInimigo = function(_inimigos,_mapaGlobalLayer){
    var listaInimigos = [{nome: 'spawnInimigoFacil',key: 'heroi',Classe: Fraco},
                         {nome: 'spawnInimigoMedio',key: 'heroi',Classe: Commando},
                         {nome: 'spawnInimigoDificil',key: 'hellKnight',Classe: HellKnight}];
    
    var inimigosDoMapa, inimigo;
    var inimigos = _inimigos;
    var i, j, maxI, maxJ;
    for (i = 0, maxI = listaInimigos.length; i < maxI; i++) {
        inimigosDoMapa = this.mapaGlobal.findObjectsByType(listaInimigos[i].nome);
        for (j = 0, maxJ = inimigosDoMapa.length; j < maxJ; j++) {
            inimigo = new listaInimigos[i].Classe(this.game, inimigosDoMapa[j].x, inimigosDoMapa[j].y, listaInimigos[i].key, 0, this.layerChaoVisivel, _inimigos, _mapaGlobalLayer);
            inimigo.cria();
            inimigo.outOfBoundsKill = true;
            inimigo.checkWorldBounds = true;
            inimigos.add(inimigo);
        }
    }
    inimigos.sort();
};

Calciumtrice.prototype.criaPortas = function (_tipo, _mapa) {
    var tiledDoors = _mapa.findObjectsByType(_tipo);
    this.doors = {};
    for (var i = 0; i < tiledDoors.length; i++) {
        var doorSprite = _mapa.spriteFromObject(tiledDoors[i], this.grupoPorta);
        this.doors[doorSprite.properties.casa] = new Door(this.game, doorSprite);
    }
    Door.init(this.game);
};

Calciumtrice.prototype.aplicaMascara = function (graficoDaMascara, listaElementos) {
    var size = listaElementos.length;
    for (var i = 0; i < size; i++) {
        if (listaElementos[i] instanceof Phaser.Group) {
            listaElementos[i].forEach(function (sprite) {
                sprite.mask = graficoDaMascara;
            }, this);
        } else {
            listaElementos[i].mask = graficoDaMascara;
        }
    }
};

Calciumtrice.prototype.criaHud = function () {
    this.hud = this.game.add.sprite(750, 480, 'hud');
//    this.hud.scale.set(0.6);
    this.hud.fixedToCamera = true;

    this.vidaJogador = this.game.add.text(30, 560, '100/100', {font: "24px Arial", fill: "#e82d00", align: "center"});
    this.vidaJogador.fixedToCamera = true;

    this.tirosJogador = this.game.add.text(30, 530, '20', {font: "24px Arial", fill: "#fdb317", align: "center"});
    this.tirosJogador.fixedToCamera = true;
    
    this.iconArmaJog = this.game.add.image(68, 512, "ak47IconHud")
    this.iconArmaJog.scale.setTo(0.3);
    this.iconArmaJog.fixedToCamera = true;
};

Calciumtrice.prototype.setAlvoDosInimigos = function (alvo, inimigos) {
    if (inimigos instanceof Phaser.Group) {
        inimigos.forEach(function (inimigo) {
            inimigo.setAlvoDoInimigo(alvo);
        }, this);
        return;
    }
    for (var i = 0; i < inimigos.length; i++) {
        inimigos[i].setAlvoDoInimigo(alvo);
    }
};

Calciumtrice.prototype.macaneta = function (player, doorSprite) {
    var door = this.doors[doorSprite.properties.casa];
    for (var i = 0; i < this.layersTelhados.length; i++) {
        if (this.layersTelhados[i].layer.name == doorSprite.properties.telhado) {
            door.overlapTrigger(player);
            this.layersTelhados[i].alpha = door.delta;
        }
    }
};

Calciumtrice.prototype.fimDeJogo = function () {
    var telaFimDeJogo = this.game.add.sprite(0, 0, "faleceu");
    telaFimDeJogo.fixedToCamera = true;
    telaFimDeJogo.alpha = 0.01;
    this.game.add.tween(telaFimDeJogo).to({alpha: 0.5}, 2000, "Linear", true);
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
        telaFimDeJogo.destroy();
        this.state.start('faleceuState');
    }, this);
};

Calciumtrice.prototype.criaEasyStar = function(dadosLayerTilemap, listaTilesPermitidos){
        var matrix = this.montaMatrixPathFinder(dadosLayerTilemap);
        this.easyStar = new EasyStar.js();
        this.easyStar.setGrid(matrix);
        this.easyStar.setAcceptableTiles(listaTilesPermitidos);
        this.easyStar.setIterationsPerCalculation(5000);
};

Calciumtrice.prototype.montaMatrixPathFinder = function (propriedadesLayer) {
    var matrixPropriedades = [];
    var countPropriedadesColuna, j, countPropriedadesLinha, i;
    var countPropriedadesLinha = propriedadesLayer.length;
    for (i = 0; i < countPropriedadesLinha; i++) {
        matrixPropriedades[i] = [];
        countPropriedadesColuna = propriedadesLayer[i].length;
        for (j = 0; j < countPropriedadesColuna; j++) {
            matrixPropriedades[i][j] = propriedadesLayer[i][j].index;
        }
    }
    return matrixPropriedades;
};

//Calciumtrice.prototype.pauseJogo = function(){
//    
//    this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
//};
