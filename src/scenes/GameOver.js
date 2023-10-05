
// You can write more code here

/* START OF COMPILED CODE */

class GameOver extends Phaser.Scene {

	constructor() {
		super("GameOver");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// game_over_BG
		this.add.image(960, 540, "game-over-BG");

		// game_over_box
		this.add.image(960, 487, "Game-over-box");

		// gameOverText
		const gameOverText = this.add.image(964, 298, "Game-over-text");

		// text_2
		const text_2 = this.add.text(960, 500, "", {});
		text_2.scaleX = 0.9;
		text_2.scaleY = 0.9;
		text_2.setOrigin(0.5, 0.5);
		text_2.text = "Your Score";
		text_2.setStyle({ "fontFamily": "AlfaSlabOne-Regular", "fontSize": "80px" });

		// totalScore
		const totalScore = this.add.text(960, 615, "", {});
		totalScore.setOrigin(0.5, 0.5);
		totalScore.text = "0";
		totalScore.setStyle({ "fontFamily": "AlfaSlabOne-Regular", "fontSize": "70px" });

		// playAgain
		const playAgain = this.add.image(960, 768, "play-again-button");

		// redFish
		const redFish = this.add.image(130, 580, "Red-fish");

		// submarine
		const submarine = this.add.image(1728, 695, "Submarine");

		this.gameOverText = gameOverText;
		this.totalScore = totalScore;
		this.playAgain = playAgain;
		this.redFish = redFish;
		this.submarine = submarine;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	gameOverText;
	/** @type {Phaser.GameObjects.Text} */
	totalScore;
	/** @type {Phaser.GameObjects.Image} */
	playAgain;
	/** @type {Phaser.GameObjects.Image} */
	redFish;
	/** @type {Phaser.GameObjects.Image} */
	submarine;

	/* START-USER-CODE */

	// Write your code here
	init(data) {
		this.sceneObj = data;
	}

	create() {
		this.editorCreate();
		this.playAgain.on('pointerover', () => this.input.setDefaultCursor('pointer'));
		this.playAgain.on('pointerout', () => this.input.setDefaultCursor('default'));

		const shakeTimeline = this.tweens.createTimeline();
		const shakeRight = {
			targets: this.gameOverText,
			x: '+=10',
			duration: 1000,
		};
		const shakeLeft = {
			targets: this.gameOverText,
			x: '-=20',
			duration: 1000,
		};
		shakeTimeline.add(shakeRight);
		shakeTimeline.add(shakeLeft);

		shakeTimeline.play();
		shakeTimeline.setCallback('onComplete', () => {
			this.tweens.add({
				targets: this.gameOverText,
				scaleX: 0.9,
				scaleY: 0.9,
				duration: 80,
				yoyo: true,
			});
		}, [], this);

		this.tweens.add({
			targets: this.playAgain,
			scale: 1.08,
			duration: 800,
			ease: 'Sine.easeInOut',
			yoyo: true,
			loop: -1
		});

		function scaleSprite(sprite, duration) {
			sprite.setScale(1.1);
			this.tweens.add({
				targets: sprite,
				scaleX: 1,
				scaleY: 1, 
				duration: duration,
				yoyo: true,
				onComplete: () => {
					scaleSprite.call(this, sprite, duration);
				}
			});
		}
		this.tweens.add({
			targets: this.redFish,
			x: 400,
			y: 580,
			duration: 4000,
			onComplete: () => {
				scaleSprite.call(this, this.redFish, 1000);
			}
		});
	
		this.tweens.add({
			targets: this.submarine,
			x:1558,
			y:695,
			duration: 4000,
			onComplete: () => {
				scaleSprite.call(this, this.submarine, 1000);
			}
		});

		this.totalScore.setText(this.sceneObj.player.power--);
		this.playAgain.setInteractive().on("pointerdown", () => {
			this.scene.stop('GameOver');
			this.scene.start('Level');
		});
		const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
		enterKey.on('down', this.onEnterKey, this);
	}

	onEnterKey() {
		this.scene.stop('GameOver');
		this.scene.start('Level');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
