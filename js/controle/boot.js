var Calciumtrice = Calciumtrice || {};

Calciumtrice.Boot = function(){
//    console.log("criacao boot");
};

Calciumtrice.Boot.prototype = {
    preload: function(){
        this.load.image('loading', 'assets/sprites/loading.png');
    },
    create: function(){
        //aqui eu digo pro mouse que o click direito dele nao vai abrir o menu
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);        
        this.state.start('preload');
    }
};