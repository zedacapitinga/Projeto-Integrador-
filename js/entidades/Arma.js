
	this.armaTeste = this.game.add.sprite(0,0, "arma");
    this.armaTeste.scale.setTo(1.1);
	this.armaTeste.animations.add("atirandoTeste", [1,2,3,4]);

//Teste Camera
    this.mouseXCamTeste = (this.mouseCamTeste.worldX + this.jogador.shadow.x) /2;
    this.mouseYCamTeste = (this.mouseCamTeste.worldY + this.jogador.shadow.y) /2;
    this.camSpriteTeste.x = this.mouseXCamTeste;
    this.camSpriteTeste.y = this.mouseYCamTeste;
    
    //Adiciona sprite de arma no jogador
	this.armaTeste.x = this.jogador.x - 7;
	this.armaTeste.y = this.jogador.y - 30;
	
	if (this.mouse.isDown) {
        this.armaTeste.animations.play("atirandoTeste");;
    }else{
		this.armaTeste.frame = 0;
	}
	
    this.hud.frame = this.jogador.numTiros;

function animaHudMuniRecarrega(){
     //  Create our tween. This will fade the sprite to alpha 1 over the duration of 2 seconds
    var tween = game.add.tween(sprite).to( { angle: 50, y: 800 }, 1000, "Linear", true, 0, -1);

    //  And this tells it to yoyo, i.e. fade back to zero again before repeating.
    //  The 3000 tells it to wait for 3 seconds before starting the fade back.
    tween.yoyo(true, 3000);

}