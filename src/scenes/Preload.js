// You can write more code here

/* START OF COMPILED CODE */

class Preload extends Phaser.Scene {

	constructor() {
		super("Preload");

		/* START-USER-CTR-CODE */
		// Write your code here.

		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorPreload() {

		this.load.pack("asset-pack", "assets/asset-pack.json");
	}

	/** @returns {void} */
	editorCreate() {

		// preload_BG
		this.add.image(960, 540, "preload-BG");

		// playBtn
		const playBtn = this.add.image(960, 917, "Play-button");
		playBtn.visible = false;

		// lOGO
		this.add.image(960, 492, "LOGO");

		// earthWorms
		const earthWorms = this.add.image(1259, 312, "WORMS");

		this.playBtn = playBtn;
		this.earthWorms = earthWorms;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	playBtn;
	/** @type {Phaser.GameObjects.Image} */
	earthWorms;

	/* START-USER-CODE */

	// Write your code here


	preload() {
		this.editorCreate();

		this.editorPreload();

		this.load.audio('sbackgroundMusic', 'assets/sounds/backgroundMusic.mp3');
		this.load.audio('sfishEat', 'assets/sounds/fishEat.wav');
		this.load.audio('sdeadFish', 'assets/sounds/deadFish.wav');
		this.load.audio('sgameEnd', 'assets/sounds/gameEnd.mp3');

		this.playBtn.setInteractive().on('pointerdown', () => {
			this.tweens.add({
				targets: this.playBtn,
				scaleX: 0.9,
				scaleY: 0.9,
				duration: 80,
				yoyo: true,
				onComplete: () => {
					this.scene.start("Level");
				}
			});
		});
		this.playBtn.on('pointerover', () => this.input.setDefaultCursor('pointer'));
		this.playBtn.on('pointerout', () => this.input.setDefaultCursor('default'));



		this.bubbles = this.add.particles("bubble-1").setDepth(10);
		this.bubbles2 = this.add.particles("bubble-2").setDepth(10);
		this.showBubbles = (bubble, x, y) => {
			this.bubbleParticles = bubble.createEmitter({
				// x: { min: 0, max: 1920 },
				// y: { min: 540, max: 1080 },
				speed: { min: -50, max: 50 },
				angle: { min: 0, max: 360 },
				scale: { start: 0.5, end: 1 },
				lifespan: 2500,
				gravityY: -200,
				frequency: 50,
			});
			this.bubbleParticles.startFollow(this.loadingRocket);
		}

		this.bubbles3 = this.add.particles("bubble-1").setDepth(10);
		this.bubbles4 = this.add.particles("bubble-2").setDepth(10);
		this.showBubblesAfterLoading = (bubble, x, y) => {
			this.bubbleParticles = bubble.createEmitter({
				x: { min: 570, max: 1350 },
				y: { min: 540, max: 725 },
				speed: { min: -50, max: 50 },
				angle: { min: 0, max: 360 },
				scale: { start: 0.5, end: 1 },
				lifespan: 2500,
				gravityY: -200,
				frequency: 500,
			});
		}


		this.outerBar = this.add.sprite(960, 917, "Loading-case").setScale(1, 1);
		this.outerBar.setOrigin(0.5);
		this.innerBar = this.add.sprite(
			this.outerBar.x - this.outerBar.displayWidth / 2 + 18,
			this.outerBar.y,
			"Loading-bar"
		).setScale(1, 1);
		this.innerBar.setOrigin(0, 0.5);

		this.loadingRocket = this.add.image(740, 918, "Loading-Fish");
		this.showBubbles(this.bubbles);
		this.innerBarWidth = this.innerBar.displayWidth;

		this.maskGraphics = this.make.graphics();
		this.maskGraphics.fillStyle(0xffffff);
		this.maskGraphics.fillRect(
			this.innerBar.x,
			this.innerBar.y - this.innerBar.displayHeight / 2,
			this.innerBar.displayWidth,
			this.innerBar.displayHeight
		);

		this.innerBar.setMask(this.maskGraphics.createGeometryMask());

		const loadingDuration = 2000;
		const intervalDuration = 30;
		const numIntervals = loadingDuration / intervalDuration;
		let currentInterval = 0;
		const progressIncrement = 1 / numIntervals;

		const updateProgressBar = () => {
			const currentProgress = currentInterval * progressIncrement;
			this.maskGraphics.clear();
			this.maskGraphics.fillStyle(0xffffff);
			this.maskGraphics.fillRect(
				this.innerBar.x,
				this.innerBar.y - this.innerBar.displayHeight / 2,
				this.innerBarWidth * currentProgress,
				this.innerBar.displayHeight
			);

			currentInterval++;
			this.loadingRocket.x = this.innerBar.x - 30 + (this.innerBarWidth * currentProgress);

			if (currentProgress >= 1) {
				clearInterval(progressInterval);
				this.innerBar.setVisible(false);
				this.outerBar.setVisible(false);
				this.loadingRocket.setVisible(false);
				this.bubbleParticles.remove();
				setTimeout(() => {
					this.playBtn.setVisible(true);
					this.tweens.add({
						targets: this.playBtn,
						scale: 1.1,
						duration: 800,
						ease: 'Sine.easeInOut',
						yoyo: true,
						loop: -1
					});
					this.tweens.add({
						targets: this.earthWorms,
						scale: 1.1,
						duration: 800,
						ease: 'Sine.easeInOut',
						yoyo: true,
						loop: -1
					});
					this.showBubblesAfterLoading(this.bubbles3, 960, 700);
					this.showBubblesAfterLoading(this.bubbles4, 960, 700);
				}, 200);
			}
		};
		const progressInterval = setInterval(updateProgressBar, intervalDuration);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
