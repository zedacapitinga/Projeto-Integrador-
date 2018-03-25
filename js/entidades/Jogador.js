/* global Phaser */

var Jogador = function (_game, _x, _y, _key, _frame) {
    Phaser.Sprite.call(this, _game, _x, _y, _key, _frame);
    this.wallLayers;
    this.linhaVisao = new Phaser.Line();

    this.vida = 100;

    this.armasJogador = [];
    
    this.andando = false;
    
    this.mira;
    this.numTiros = 20;
    this.tempoProximoTiro = 0;
    this.carregando = false;
    this.danoTiro = 25;    
    this.tiros;
    
    this.hudTiro;
    this.hudVida;

    this.luz = this.game.add.graphics(0, 0);
    this.shadow;

    this.groupInimigos;

    this.norte = [17, 16, 15, 14, 13, 12, 11, 10, 9];
    this.sul = [62, 61, 60, 59, 58, 57, 56, 55, 54];
    this.leste = [35, 34, 33, 32, 31, 30, 29, 28, 27];
    this.oeste = [44, 43, 42, 41, 40, 39, 38, 37, 36];
    this.noroeste = [8, 7, 6, 5, 4, 3, 2, 1, 0];
    this.nordeste = [26, 25, 24, 23, 22, 21, 20, 19, 18];
    this.suldoeste = [53, 52, 51, 50, 49, 48, 47, 46, 45];
    this.suldeste = [71, 70, 69, 68, 67, 66, 65, 64, 63];


    this.game.physics.arcade.enable(this);
    this.enableBody = true;
    this.anchor.setTo(0.5, 0.98);
    this.game.camera.follow(this);
    this.criaSombra();
    this.tempoProximoPasso = 0;
    this.frequenciaPasso = 800;
};

Jogador.prototype = Object.create(Phaser.Sprite.prototype);
Jogador.prototype.constructor = Jogador;

Jogador.prototype.velocidade = 500;
//vai mudar para Arma
Jogador.prototype.velocidadeTiro = 5000;
Jogador.prototype.frequenciaTiro = 200;
Jogador.prototype.maxTiros = 50;
Jogador.prototype.tempoRecarregamentoArma = 1;
//aqui teste arma
Jogador.prototype.tempoUltimoTiro = 0;

Jogador.prototype.aberturaLuz = Math.PI * 2;
Jogador.prototype.comprimentoLuz = 75;
Jogador.prototype.raiosLuz = 360;

Jogador.prototype.tecla_Norte;
Jogador.prototype.tecla_Sul;
Jogador.prototype.tecla_Leste;
Jogador.prototype.tecla_Oeste;
Jogador.prototype.tecla_Corrida;
Jogador.prototype.tecla_Recarrega;
Jogador.prototype.mouse;

Jogador.prototype.direcoes = ["N", "S", "L", "O", "NO", "NL", "SO", "SL"];

Jogador.prototype.cria = function (_layerOfWall, _groupInimigos) {
    this.wallLayers = _layerOfWall;
    this.criaAnimacoes();
    this.criaAudio();
    this.groupInimigos = _groupInimigos;

    if (!this.tecla_Norte || !this.tecla_Sul || !this.tecla_Leste || !this.tecla_Oeste || !this.mouse) {
        this.criaInputs();
    }

    this.criaTiros();    
    this.criaCapsulaChao();    
    this.mira = this.game.add.sprite(0, 0, 'mira');
    this.mira.anchor.setTo(0.5);
    this.camSpriteTeste = this.game.add.sprite(0, 0, 'mira');
    this.camSpriteTeste.anchor.setTo(0.5);
    this.camSpriteTeste.alpha = 0;
    this.game.camera.follow(this.camSpriteTeste);
	
	this.position.setTo(this.shadow.position.x, this.shadow.position.y);
};

Jogador.prototype.criaAudio = function () {
    this.somJogador = this.game.add.audio('efeitos');
    this.somJogador.allowMultiple = true;
    this.somJogador.addMarker('tiro', 0, 0.629, 0.2);
    this.somJogador.addMarker('reload', 0.629, 0.970);
    this.somJogador.addMarker('dano', 1.599, 1.182);
    this.somJogador.addMarker('burn', 2.789, 1.652);
    this.somJogador.addMarker('morte', 4.441, 1.152);
    this.somJogador.addMarker('granada', 5.593, 2.110);
    this.somJogadorCaminhaConcreto = this.game.add.audio('somPassoConcreto', 0.2, false, true);
}

Jogador.prototype.criaTiros = function () {
    this.tiros = this.game.add.group();
    this.game.physics.arcade.enable(this.tiros);
    this.tiros.enableBody = true;
    this.tiros.createMultiple(30, "projetil2", 0, false);
    this.tiros.forEach(function (sprite) {
        sprite.anchor.setTo(0.5);
        sprite.outOfBoundsKill = true;
        sprite.checkWorldBounds = true;
        sprite.animations.add('inicioTiro');
        sprite.events.onAnimationComplete = function () {
            this.frame = 1;
        };
    }, this);
};

Jogador.prototype.criaCapsulaChao = function(){
    this.capsulasNoChao = this.game.add.group();
    this.capsulasNoChao.createMultiple(999, "capsula", 0, false);
};

Jogador.prototype.criaAnimacoes = function () {
    this.animations.add('N', this.norte, 10, true);
    this.animations.add('S', this.sul, 10, true);
    this.animations.add('L', this.leste, 10, true);
    this.animations.add('O', this.oeste, 10, true);
    this.animations.add('NO', this.noroeste, 10, true);
    this.animations.add('NL', this.nordeste, 10, true);
    this.animations.add('SO', this.suldoeste, 10, true);
    this.animations.add('SL', this.suldeste, 10, true);

    this.animations.add('rev_N', this.norte.reverse(), 10, true);
    this.animations.add('rev_S', this.sul.reverse(), 10, true);
    this.animations.add('rev_L', this.leste.reverse(), 10, true);
    this.animations.add('rev_O', this.oeste.reverse(), 10, true);
    this.animations.add('rev_NO', this.noroeste.reverse(), 10, true);
    this.animations.add('rev_NL', this.nordeste.reverse(), 10, true);
    this.animations.add('rev_SO', this.suldoeste.reverse(), 10, true);
    this.animations.add('rev_SL', this.suldeste.reverse(), 10, true);
};

Jogador.prototype.criaInputs = function () {
    Jogador.prototype.tecla_Norte = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    Jogador.prototype.tecla_Sul = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    Jogador.prototype.tecla_Leste = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    Jogador.prototype.tecla_Oeste = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    Jogador.prototype.tecla_Corrida = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    Jogador.prototype.tecla_Recarrega = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
    Jogador.prototype.mouseJogador = this.game.input.mousePointer;
};

Jogador.prototype.criaSombra = function () {
    this.shadow = this.game.add.sprite(this.position.x, this.position.y, 'tilesetSpriteSheet', 960);
    this.game.physics.arcade.enable(this.shadow);
    this.shadow.alpha = 0;
    this.shadow.anchor.setTo(0.5, 1);
    this.shadow.body.immovable = true;
};

Jogador.prototype.setHud = function (_hudTiro, _hudVida, _Pente) {
    this.hudTiro = _hudTiro;
    this.hudVida = _hudVida;
    this.hud = _Pente;
    this.hud.frame = this.numTiros;
};

//                 UPDATE
Jogador.prototype.update = function () {
    var _self = this;
    var mouseX = this.mouseJogador.worldX;
    var mouseY = this.mouseJogador.worldY;
    
    this.shadow.body.velocity.y = 0;
    this.shadow.body.velocity.x = 0;
    
    this.distanciaCamMouseX = (this.mouseJogador.worldX + this.shadow.x) /2;
    this.distanciaCamMouseY = (this.mouseJogador.worldY + this.shadow.y) /2 ;    
    this.camSpriteTeste.x = this.distanciaCamMouseX;
    this.camSpriteTeste.y = this.distanciaCamMouseY;
    var radianos = Math.atan2(this.y - mouseY, this.x - mouseX);
    this.mira.position.setTo(mouseX, mouseY);
    this.desenhaLuz(radianos);
    var direcao = this.anguloMouseJogador(radianos);
    
    if (this.tecla_Recarrega.isDown && !this.carregando && this.numTiros != 20) {
        this.recarrega();
    } else if (this.mouseJogador.isDown) {
        this.atira();
    }
    if (this.tecla_Norte.isDown || this.tecla_Sul.isDown || this.tecla_Leste.isDown || this.tecla_Oeste.isDown) {
        this.jogadorAnda(direcao);
    } else {
        this.jogadorGira(direcao);
    }
    
    if(this.tiros.getFirstAlive()){
        var _bala = this.tiros.getFirstAlive();
        _self.game.physics.arcade.collide(_bala, _self.groupInimigos, function (_Bala, _inimigo) {
            _self.mataBala(_Bala, _inimigo);
        }  );                                       
        _self.game.physics.arcade.collide(_bala, _self.wallLayers, function (_Bala, parede) {
            _self.mataBalaParede(_Bala, parede);
        });
    };

    this.game.physics.arcade.overlap(this.shadow, this.groupInimigos, function (_sombra, _inimigo) {
        _self.recebeAtaque(_inimigo);
    });  
    
};

Jogador.prototype.recarrega = function () {
    this.somJogador.play('reload');
    this.carregando = true;
    this.game.time.events.add(Phaser.Timer.SECOND * this.tempoRecarregamentoArma, this.fimRecarrega, this);
};

Jogador.prototype.fimRecarrega = function () {
    this.numTiros = 20;
    this.carregando = false;    
    this.hud.frame = this.numTiros;
};

Jogador.prototype.atira = function () {
    var mousePrecisao = this.mouseJogador;
    if (this.numTiros <= 0) {
        return;
    }
    if (this.carregando) {
        return;
    }
    if (this.game.time.now > this.tempoProximoTiro && this.tiros.countDead() > 0) {
        this.somJogador.play('tiro');
        this.numTiros--;        
        this.tempoProximoTiro = this.game.time.now + this.frequenciaTiro;
        var tiro = this.tiros.getFirstExists(false);
        tiro.reset(this.position.x, this.position.y - this.height / 2);
        var capsulaChao = this.capsulasNoChao.getFirstExists(false);
        capsulaChao.reset(this.position.x, this.position.y - this.height / 2);    
//        console.log(this.tempoUltimoTiro - this.tempoProximoTiro);
        
        this.game.camera.shake(0.005, 100);
        if((this.tempoProximoTiro - this.tempoUltimoTiro) < 500  ){
//        console.log("rajada");
            //mecher no worldX do mouse pra ficar no modo rajada
            //aqui ao inves de dar o mouse como angulo trocar para o angulo com ou sem precisao
//            mousePrecisao.worldX = mousePrecisao.worldX + Math.floor(Math.random() * 5);
//            mousePrecisao.worldY = mousePrecisao.worldY + Math.floor(Math.random() * 5);
            tiro.rotation = this.moveToPontero(tiro, this.velocidadeTiro, mousePrecisao);
//            tiro.rotation = this.game.physics.arcade.moveToPointer(tiro, this.velocidadeTiro, mousePrecisao);
            tiro.animations.frame = 1;
            this.tempoUltimoTiro = this.game.time.now;
        }
        else{
//        console.log("rip");
            tiro.rotation = this.game.physics.arcade.moveToPointer(tiro, this.velocidadeTiro, this.mouseJogador); 
            tiro.animations.frame = 1;
            this.tempoUltimoTiro = this.game.time.now;
        }
        
        var capsulaTween = this.game.add.tween(capsulaChao).to( { 
            angle:1080, 
            x : this.position.x + 50, 
            y: this.position.y + 10}, 1000, "Linear" ,true).onComplete.add(function() {  
                                                            this.game.time.events.add(10, function() { this.animaCapsula(capsulaChao) }, this);}, this);
        this.hudTiro.setText(this.numTiros);
        this.hud.frame = this.numTiros;
    }
};

Jogador.prototype.animaCapsula = function(_sprite){
    var aleN = Math.floor(Math.random()* 180);
    var animacao = this.game.add.tween(_sprite).to( { angle:aleN}, 400, "Linear", true);
    return;
};

Jogador.prototype.desenhaLuz = function (radianos) {
    var comprimentoGrande = 3 * this.comprimentoLuz;
    var comprimentoPequeno = this.comprimentoLuz;
    var distAtual, anguloRaio, ultimoX, ultimoY, listaTiles, menorDistancia;
    var xTile, yTile, xAtual, yAtual, distanciaAtual;

    this.luz.clear();
    this.luz.lineStyle(1, 0xFFFF00, 1);
    this.luz.beginFill(0xffff00);
    this.luz.moveTo(this.position.x, this.position.y);
    for (var j = 0; j < this.raiosLuz; j++) {
        if (j >= 135 && j <= 225) {
            distAtual = comprimentoGrande * 3;
        } else {
            distAtual = comprimentoPequeno;
        }
        anguloRaio = radianos - (this.aberturaLuz / 2) + (this.aberturaLuz / this.raiosLuz) * j;
        
        ultimoX = this.position.x - distAtual * Math.cos(anguloRaio);
        ultimoY = this.position.y - distAtual * Math.sin(anguloRaio);

        this.linhaVisao.start.set(this.position.x, this.position.y);
        this.linhaVisao.end.set(ultimoX, ultimoY);

        listaTiles = this.wallLayers.getRayCastTiles(this.linhaVisao, 32, true, true);
        menorDistancia = distAtual;
        for (var i = 0; i < listaTiles.length; i++) {
            xTile = listaTiles[i].x * listaTiles[i].width;
            yTile = listaTiles[i].y * listaTiles[i].height;
            xAtual = Math.abs(this.position.x - xTile);
            yAtual = Math.abs(this.position.y - yTile);
            distanciaAtual = Math.sqrt(xAtual * xAtual + yAtual * yAtual);
            if (menorDistancia > distanciaAtual) {
                menorDistancia = distanciaAtual;
                ultimoX = xTile + listaTiles[i].width / 2;
                ultimoY = yTile + listaTiles[i].height / 2;
            }
        }
        this.luz.lineTo(ultimoX, ultimoY);
    }
    this.luz.lineTo(this.position.x, this.position.y);
    this.luz.endFill();
};

Jogador.prototype.jogadorGira = function (direcao) {
    switch (direcao) {
        case 0:
            this.frame = 17;
            break;
        case 1:
            this.frame = 62;
            break;
        case 2:
            this.frame = 35;
            break;
        case 3:
            this.frame = 44;
            break;
        case 4:
            this.frame = 8;
            break;
        case 5:
            this.frame = 24;
            break;
        case 6:
            this.frame = 52;
            break;
        case 7:
            this.frame = 71;
            break;
    }
    this.andando = false;
};

Jogador.prototype.jogadorAnda = function (direcao) {
    var animacao = this.direcoes[direcao];
    var invertido = false;
    var velocidadeAtual = this.velocidade;
    this.andando = true;

    if (this.tecla_Corrida.isDown) {
        velocidadeAtual *= 2.5;     
    }

    if (this.tecla_Norte.isDown) {
        this.shadow.body.velocity.y -= velocidadeAtual;
        if (this.direcoes[direcao].indexOf("S") != -1) {
            animacao = "rev_" + animacao;
            invertido = true;
        }
    } 
    else if (this.tecla_Sul.isDown) {
        this.shadow.body.velocity.y += velocidadeAtual;
        if (this.direcoes[direcao].indexOf("N") != -1) {
            animacao = "rev_" + animacao;
            invertido = true;
        }
    }

    if (this.tecla_Oeste.isDown) {
        this.shadow.body.velocity.x -= velocidadeAtual;
        if (this.direcoes[direcao].indexOf("L") != -1 && !invertido) {
            animacao = "rev_" + animacao;
        }
    } 
    else if (this.tecla_Leste.isDown) {
        this.shadow.body.velocity.x += velocidadeAtual;
        if (this.direcoes[direcao].indexOf("O") != -1 && !invertido) {
            animacao = "rev_" + animacao;
        }
    }
    this.animations.play(animacao);
    
    
    this.position.setTo(this.shadow.position.x, this.shadow.position.y);  
};

Jogador.prototype.recebeAtaque = function (_inimigo) {
    if (this.vida <= 0) {
        return false;
    }
    if (_inimigo.ataque()) {
        this.danoTela = this.game.add.sprite(0, 0, "danoIndicador");
        this.danoTela.fixedToCamera = true;
        this.game.add.tween(this.danoTela).to( { alpha: 0 }, 2000, "Linear", true);
        this.velocidade = 25;
        this.somJogador.play('dano');        
        this.vida -= _inimigo.dano;
        var bloodHit = this.game.add.emitter(0, 0, 100);
        bloodHit.makeParticles("sangue");
        bloodHit.gravity = 200;
        bloodHit.x = this.x - 10;
        bloodHit.y = this.y - 32;
        bloodHit.start(true, 1000, null, 10);
        var numeroRand = Math.floor(Math.random() * 6) + 64;
        var sangueChao = this.game.add.sprite(this.shadow.x - 10, this.shadow.y - 20, "doom_tileset_spritesheet", numeroRand);
        sangueChao.mask = this.mask;
        this.game.time.events.add(2000, function(){bloodHit.destroy();}, this);
        this.game.time.events.add(2000, function(){this.velocidade = 50;}, this);
    }
    
    this.hudVida.setText(this.vida + "/100");
    return true;
};

Jogador.prototype.mataBala = function (bala, _inimigo) {
    bala.kill();
    _inimigo.recebeDano(this.danoTiro);
//    this.animacaoBala(bala);
};

Jogador.prototype.mataBalaParede = function (bala, parede) {
    bala.kill();
    this.animacaoBala(bala);
//    console.log(parede);
};

Jogador.prototype.animacaoBala = function (_bala) {
    this.toon = this.game.add.sprite(_bala.position.x, _bala.position.y, 'toon');
    this.toon.anchor.setTo(0.5);
    var animacao = this.toon.animations.add('toon', null, 200, false);
    animacao.angle = Math.random() * 360;
    this.toon.scale.set(0.5);
    animacao.play(200, false, true);
};

Jogador.prototype.anguloMouseJogador = function(_radianos){
    
//    var step = Math.PI * 2 / 360 ;
//
//    function update(){
//    // Move sprite up and down smoothly for show
//    var tStep = Math.sin( counter ) ;
//    sprite.y = (game.height/2) + tStep * 30 ;
//    sprite.rotation += Phaser.Math.degToRad( 0.1 * tStep ) ;
//    counter += step ;
//    }

    
    
    var angulo = _radianos * (180 / Math.PI);
    var anguloTTeste;
    //para virar o 0 para o lado esquerdo
    if (angulo > 0) {    
        angulo -= 180; 
    } 
    else {
        angulo += 180 - 360;
    }
    
    angulo = Math.abs(angulo.toFixed(0));
    
    if (angulo > 30 && angulo <= 60) {
        //cima direita NE || 
        return 5;
    }
    else if (angulo >= 60 && angulo <= 120) {
        //cima N
        return 0;
    }
   else if (angulo >= 120 && angulo <= 150) {
        //cima esquerda NO
        return 4;
    }
    else if (angulo >= 150 && angulo <= 210) {
        //esquerda O
        return 3;
    }
    else if (angulo >= 210 && angulo <= 240) {
        //baixo esquerda SO
        return 6;
    }
    else if (angulo >= 240 && angulo <= 300) {
        //baixo S
        return 1;
    }
    else if (angulo >= 330 || angulo <= 30) {
        //direita L || 
        return 2;
    }else { 
        //baixao direita SE
        return 7;
    
    }
};

Jogador.prototype.moveToPontero = function(displayObject, speed, pointer, maxTime){
    //funçao do phaser editada porque eu quero usar o angleToPointer (agr anguloToPontero)
    //para fazer a pricisao da arma, depois fazer calculos em radianos que facilita... talves
    if (typeof speed === 'undefined') { speed = 60; }
    var pointer = this.game.input.activePointer;
    if (typeof maxTime === 'undefined') { maxTime = 0; }

    var angle = this.anguloToPontero(displayObject, pointer);

    if (maxTime > 0)
    {
        //  We know how many pixels we need to move, but how fast?
        speed = this.game.distanceToPointer(displayObject, pointer) / (maxTime / 1000);
    }

    displayObject.body.velocity.x = Math.cos(angle) * speed;
    displayObject.body.velocity.y = Math.sin(angle) * speed;

    return angle;

};

Jogador.prototype.anguloToPontero = function(displayObject, pointer){

    var pointer = this.game.input.activePointer;

    var dx = pointer.worldX - displayObject.x;
    var dy = pointer.worldY - displayObject.y;
    
    if(dx > 0){
        dx = dx + Math.floor(Math.random() * 80);
    }
    else{
        dx = dx - Math.floor(Math.random() * 80);
    }
    if(dy > 0){
        dy = dy + Math.floor(Math.random() * 80);
    }
    else{
        dy = dy - Math.floor(Math.random() * 80);
    }
    
    return Math.atan2(dy, dx);

};