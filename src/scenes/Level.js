// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.

		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// bG
		this.add.image(960, 540, "BG");

		// Gamecontainer
		this.add.container(0, 0);

		// fishes
		const fishes = new Fishes(this, 2100, 200);
		this.add.existing(fishes);

		// earthWorm
		const earthWorm = new EarthWorm(this, 123, -132);
		this.add.existing(earthWorm);

		// submarineCartoon
		const submarineCartoon = new SubmarineCartoon(this, 2220, 10);
		this.add.existing(submarineCartoon);

		// lifeOne
		const lifeOne = this.add.image(290, 70, "lifeOn");

		// lifeTwo
		const lifeTwo = this.add.image(180, 70, "lifeOn");

		// lifeThree
		const lifeThree = this.add.image(70, 70, "lifeOn");

		// fishSkeleton
		const fishSkeleton = this.add.sprite(960, 540, "fishSkeleton", 0);
		fishSkeleton.scaleX = 0.5;
		fishSkeleton.scaleY = 0.5;
		fishSkeleton.visible = false;

		// earthwormMiss
		const earthwormMiss = this.add.text(960, 540, "", {});
		earthwormMiss.setOrigin(0.5, 0.5);
		earthwormMiss.visible = false;
		earthwormMiss.text = "Earthworm is missed!";
		earthwormMiss.setStyle({ "color": "#ffffffff", "fontFamily": "AlfaSlabOne-Regular", "fontSize": "40px", "stroke": "#ffffffff" });

		// dontMissText
		const dontMissText = this.add.text(960, 540, "", {});
		dontMissText.setOrigin(0.5, 0.5);
		dontMissText.text = "Don't Miss Earthworm";
		dontMissText.setStyle({ "color": "#ffffffff", "fontFamily": "AlfaSlabOne-Regular", "fontSize": "40px" });

		// plusFive
		const plusFive = this.add.text(939, 241, "", {});
		plusFive.visible = false;
		plusFive.text = "+5";
		plusFive.setStyle({ "color": "#ffffffff", "fontFamily": "AlfaSlabOne-Regular", "fontSize": "20px" });

		// plusOne
		const plusOne = this.add.text(972, 173, "", {});
		plusOne.visible = false;
		plusOne.text = "+2";
		plusOne.setStyle({ "color": "#ffffffff", "fontFamily": "AlfaSlabOne-Regular", "fontSize": "20px" });

		// largerThanYou
		const largerThanYou = this.add.text(960, 471, "", {});
		largerThanYou.setOrigin(0.5, 0.5);
		largerThanYou.visible = false;
		largerThanYou.text = "It was larger than you!";
		largerThanYou.setStyle({ "color": "#ffffffff", "fontFamily": "AlfaSlabOne-Regular", "fontSize": "40px" });

		// _Score_Board
		this.add.image(960, 60, "_Score-Board");

		// scoreZero
		const scoreZero = this.add.text(980, 69, "", {});
		scoreZero.setOrigin(0.5, 0.5);
		scoreZero.text = "0";
		scoreZero.setStyle({ "color": "#070707ff", "fontFamily": "AlfaSlabOne-Regular", "fontSize": "50px" });

		// score_Text
		this.add.image(860, 64, "Score-Text");

		this.fishes = fishes;
		this.earthWorm = earthWorm;
		this.submarineCartoon = submarineCartoon;
		this.lifeOne = lifeOne;
		this.lifeTwo = lifeTwo;
		this.lifeThree = lifeThree;
		this.fishSkeleton = fishSkeleton;
		this.earthwormMiss = earthwormMiss;
		this.dontMissText = dontMissText;
		this.plusFive = plusFive;
		this.plusOne = plusOne;
		this.largerThanYou = largerThanYou;
		this.scoreZero = scoreZero;

		this.events.emit("scene-awake");
	}

	/** @type {Fishes} */
	fishes;
	/** @type {EarthWorm} */
	earthWorm;
	/** @type {SubmarineCartoon} */
	submarineCartoon;
	/** @type {Phaser.GameObjects.Image} */
	lifeOne;
	/** @type {Phaser.GameObjects.Image} */
	lifeTwo;
	/** @type {Phaser.GameObjects.Image} */
	lifeThree;
	/** @type {Phaser.GameObjects.Sprite} */
	fishSkeleton;
	/** @type {Phaser.GameObjects.Text} */
	earthwormMiss;
	/** @type {Phaser.GameObjects.Text} */
	dontMissText;
	/** @type {Phaser.GameObjects.Text} */
	plusFive;
	/** @type {Phaser.GameObjects.Text} */
	plusOne;
	/** @type {Phaser.GameObjects.Text} */
	largerThanYou;
	/** @type {Phaser.GameObjects.Text} */
	scoreZero;

	/* START-USER-CODE */

	// Write more your code here
	playerSpeed = 10;
	isMovementDisabled = false;

	create() {
		this.editorCreate();
		this.input.setDefaultCursor('default');
		this.time.delayedCall(2500, () => {
			this.dontMissText.setVisible(false);
		}, [], this);

		this.backgroundSound = this.sound.add('sbackgroundMusic');
		this.backgroundSound.play();
		this.backgroundSound.loop = true;
		this.fishEating = this.sound.add('sfishEat');
		this.fishDead = this.sound.add('sdeadFish');
		this.gameEnding = this.sound.add('sgameEnd');

		this.player = this.physics.add.sprite(960, 110, "player");
		this.player.setScale(0.8, 0.8);
		this.isPlayerAlive = true;
		this.resetPlayerPosition();
		this.player.power = 0;
		// boundary boxes
		this.box = this.physics.add.sprite(960, 1095, "box");
		this.box.setVisible(false);
		this.box.setScale(7.5, 1);

		this.box1 = this.physics.add.sprite(-350, 540, "box1");
		this.box1.setVisible(false);
		this.box1.setScale(2, 32);

		this.box2 = this.physics.add.sprite(2400, 540, "box2");
		this.box2.setVisible(false);
		this.box2.setScale(3, 32);
	}

	resetPlayerPosition() {
		this.disableMovementForOneSecond();
		this.player.setVisible(true);
		this.fishSkeleton.setVisible(false);
		this.player.setBodySize(95, 45, true);
		this.player.setOffset(7, 10);
		this.player.x = 980;
		this.player.y = 60;
		this.player.setCollideWorldBounds(true);

		this.player.setAlpha(0);
		this.tweens.add({
			targets: this.player,
			alpha: 1,
			scaleX: this.player.scaleX,
			scaleY: this.player.scaleY,
			duration: 2500,
			ease: 'Linear',
		});

		if (this.fishes.playerLives == 2) {
			this.lifeOne.setTexture('lifeOff');
		}
		if (this.fishes.playerLives == 1) {
			this.lifeTwo.setTexture('lifeOff');
		}
		if (this.fishes.playerLives == 0) {
			this.lifeThree.setTexture('lifeOff');
		}
	}

	disableMovementForOneSecond() {
		this.playerSpeed = 0;

		this.time.delayedCall(3000, () => {
			this.playerSpeed = 10; // Restore the player's speed after 1 second
		}, [], this);
	}

	update() {
		const cursors = this.input.keyboard.createCursorKeys();
		if (this.isPlayerAlive) {
			if (cursors.left.isDown) {
				this.player.flipX = false;
				this.fishSkeleton.flipX = false;
				this.player.x -= this.playerSpeed;
			} else if (cursors.right.isDown) {
				this.player.flipX = true;
				this.fishSkeleton.flipX = true;
				this.player.x += this.playerSpeed;
			}
			if (cursors.up.isDown) {
				this.player.y -= this.playerSpeed;
			} else if (cursors.down.isDown) {
				this.player.y += this.playerSpeed;
			}
		}
	}


	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
