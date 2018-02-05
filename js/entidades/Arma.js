    var objetoArma = function(_sprite, _spriteM, _nome, _velT, _freqT, _tempRe, _numT, _fireHate, _dano){
        
        this.spriteArma = _sprite;
        this.spriteMunicao = _spriteM;
        this.animationsArma;
        this.nomeArma = _nome;
        this.velocidadeTiro = _velT;
        this.frequenciaTiro = _freqT;
        this.maxTiros = 50;
        this.tempoRecarregamentoArma = _tempRe;    
        this.numTiros = _numT;
        this.tempoProximoTiro = _fireHate;
        this.carregando = false;
        this.danoTiro = _dano; 
        
        
//        this.armaTeste = this.game.add.sprite(0,0, "arma");
//        this.armaTeste.scale.setTo(1.1);
//        this.armaTeste.animations.add("atirandoTeste", [1,2,3,4]);
        
        };

    objetoArma.prototype.criaTiros = function () {
        this.tiros = this.game.add.group();
        this.game.physics.arcade.enable(this.tiros);
        this.tiros.enableBody = true;
        this.tiros.createMultiple(30, "projetil", 0, false);
        this.tiros.forEach(function (sprite) {
            sprite.anchor.setTo(1, 0.5);
            sprite.outOfBoundsKill = true;
            sprite.checkWorldBounds = true;
    //        sprite.animations.add('inicioTiro');
    //        sprite.events.onAnimationComplete = function () {
    //            this.frame = 8;
    //        };
            }, this);
    };

    objetoArma.prototype.atira = function (mouseX, mouseY) {
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
            if (mouseX > this.world.x) {
                tiro.reset(this.position.x - 15, this.position.y - this.height / 2);
            } else {
                tiro.reset(this.position.x + 15, this.position.y - this.height / 2);
            }
            tiro.rotation = this.game.physics.arcade.moveToPointer(tiro, this.velocidadeTiro, this.mouse);
    //        tiro.animations.play("inicioTiro");
        }
    };

    objetoArma.prototype.recarrega = function () {
        this.somJogador.play('reload');
        this.carregando = true;
        this.game.time.events.add(Phaser.Timer.SECOND * this.tempoRecarregamentoArma, this.fimRecarrega, this);
    };

    objetoArma.prototype.fimRecarrega = function () {
        this.numTiros = 20;
        this.carregando = false;
    };

    objetoArma.prototype.update = function(){

        //Adiciona sprite de arma no jogador
        this.armaTeste.x = this.jogador.x - 7;
        this.armaTeste.y = this.jogador.y - 30;

        if (this.mouse.isDown) {
            this.armaTeste.animations.play("atirandoTeste");;
        }
        else{
            this.armaTeste.frame = 0;
        }

        this.hud.frame = this.jogador.numTiros; 


        this.tiros.forEach(function (_bala) {
            _self.game.physics.arcade.collide(_bala, _self.groupInimigos, function (_Bala, _inimigo) {
                _self.mataBala(_Bala, _inimigo);
            });
            _self.game.physics.arcade.collide(_bala, _self.wallLayers, function (_Bala, parede) {
                _self.mataBalaParede(_Bala, parede);
            });
        }, this);

    };

    objetoArma.prototype.mataBala = function (bala, _inimigo) {
        bala.kill();
        _inimigo.recebeDano(this.danoTiro);
    //    this.animacaoBala(bala);
    };

    objetoArma.prototype.mataBalaParede = function (bala, parede) {
        bala.kill();
        this.animacaoBala(bala);
    };

    objetoArma.prototype.animacaoBala = function (_bala) {
        this.toon = this.game.add.sprite(_bala.position.x, _bala.position.y, 'toon');
        this.toon.anchor.setTo(0.5);
        var animacao = this.toon.animations.add('toon', null, 200, false);
        animacao.angle = Math.random() * 360;
        this.toon.scale.set(0.5);
        animacao.play(200, false, true);
    };
