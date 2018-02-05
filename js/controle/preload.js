var Calciumtrice = Calciumtrice || {};

Calciumtrice.Preload = function(){};

Calciumtrice.Preload.prototype ={
    preload: function(){
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loading');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);       
        
        this.load.image('doom_porta', 'assets/sprites/doom_porta.png');
        this.load.image('sangue', 'assets/sprites/sangue.png');
        this.load.spritesheet('novojogobt', 'assets/sprites/novojogobt.png', 280, 94);
        this.load.spritesheet('continuabt', 'assets/sprites/continuarbt.png', 280, 94);
        this.load.spritesheet('opcoesbt', 'assets/sprites/opcoesbt.png', 280, 94);
        this.load.image('projetil', 'assets/sprites/projetil.png');
        this.load.image('somIcone', 'assets/sprites/somIcone.png');
        
        this.load.image('grassLandTileset', 'assets/tileset/grassland.png');
        this.load.image('porta', 'assets/sprites/porta.png');
        this.load.image('zero', 'assets/sprites/zero.png');
		
        this.load.spritesheet('hud', 'assets/sprites/hudMunArmaUm.png', 30, 106);
//        this.load.spritesheet('arma', 'Assetestestes/armadeancorateste1.png', 5, 28);
        
        this.load.tilemap('mapaVariosInimigos', 'assets/tilemap/mapaTeste01.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('faleceu', 'assets/sprites/fundo-game-over.png');
        this.load.image('fundoMenu', 'assets/sprites/fundo.png');
        this.load.spritesheet('heroi', 'assets/sprites/char.png', 55.5, 64.8);
        this.load.spritesheet('hellKnight', 'assets/sprites/hellKnight.png', 70, 81);
        this.load.spritesheet('commando', 'assets/sprites/commando.png', 72, 67);
        this.load.spritesheet('tilesetSpriteSheet', 'assets/sprites/dungeon_tileset_calciumtrice.png', 16, 16);
        this.load.spritesheet('tiro', 'assets/sprites/bala.png', 14, 8);
        this.load.spritesheet('botaoMenu', 'assets/sprites/botao.png', 454, 58);
        this.load.spritesheet('toon', 'assets/sprites/toon.png', 96, 96);
        this.load.spritesheet('botaoTentarNovamente', 'assets/sprites/final.png', 409, 52);
        
        this.load.audio('somMenu', 'assets/som/somMenu.ogg');
        this.load.audio('somFaleceu', 'assets/som/risada.ogg');
        this.load.audio('efeitos', 'assets/som/efeitos.ogg');
        this.load.audio('somFase', 'assets/som/somDeFundoCalmo.ogg');
        this.load.audio('somZumbi', 'assets/som/sonsZumbi.ogg');
        this.load.audio('somPortaA', 'assets/som/doorOpen_1.ogg');
        this.load.audio('somPortaF', 'assets/som/doorClose_4.ogg');
        
        this.load.audio('somPassoConcreto', 'assets/som/somPassoConcreto.wav');
        
        this.load.image('mira', 'assets/sprites/aim.png');
        
        this.game.time.advancedTiming = true;
        
        
    },
    create: function(){
        iniciaBanco('fase_01');
//         this.btStart = this.add.button( 400,  500, 'novojogobt', this.novoJogo, this, 1, 0, 1);
        this.state.start('menu');
    }
};
