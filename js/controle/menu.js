var Calciumtrice = Calciumtrice || {};

Calciumtrice.Menu = function () {
};

Calciumtrice.Menu.prototype = {
    create: function () {
        this.game.add.sprite(0, 0, 'fundoMenu');
//        this.somIcone = this.add.button(700, 500, "somIcone", this.somDoMenu ,this, 0, 0, 0);
        
        this.btNovoJogo = this.add.button(this.game.world.centerX, this.game.world.centerY , 'novojogobt', this.novoJogo, this, 1, 0, 1);
        this.btNovoJogo.anchor.set(0.5);
        
        this.btContinuaJogo = this.add.button(this.game.world.centerX, this.game.world.centerY + 150, 'continuabt', this.continuaJogo, this, 1,0,1);
        this.btContinuaJogo.anchor.set(0.5);
        
        this.mira = this.add.sprite(0, 0, 'mira');
        this.mira.anchor.setTo(0.5);
        
    },
    update: function () {
        this.mira.position.setTo(this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY);
        
    },
    novoJogo: function(){
        this.game.state.start('fase_01');
    },
    continuaJogo: function(){
        this.game.state.start(getFase());
    },
    opcaoJogo: function(){
        this.game.state.start("opcaoMenu");
    }
}
