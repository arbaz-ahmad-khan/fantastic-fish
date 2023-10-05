/* START OF COMPILED CODE */

class EarthWorm extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 0, y ?? 0);

		// earthworm
		const earthworm = scene.add.image(0, 0, "earthworm1");
		this.add(earthworm);

		this.earthworm = earthworm;

		/* START-USER-CTR-CODE */
		// Write your code here.

		this.scene.add.existing(this);
		this.scene = scene;

		this.earthwormArray = ["earthworm1", "earthworm2", "earthworm3", "earthworm4"];
		this.startEarthWormInterval();
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	earthworm;

	/* START-USER-CODE */

	randomXPosition() {
		return Math.floor(Math.random() * 1001) + 200;
	}

	earthwormCollision(oEarthworm, scene) {
		scene.physics.add.collider(scene.player, oEarthworm, (_, e) => {
			scene.fishEating.play();
			scene.player.play('fishEat')
			e.destroy();
			scene.plusOne.x = scene.player.x + 20;
			scene.plusOne.y = scene.player.y - 40;
			scene.plusOne.setVisible(true)
			scene.time.delayedCall(500, () => {
				scene.plusOne.setVisible(false);
			}, [], scene);
			scene.player.power += 2;
			scene.scoreZero.setText(scene.player.power);
			scene.player.scaleX += 0.001;
			scene.player.scaleY += 0.001;
			scene.player.setVelocity(0);
		}, null, scene);
	}

	bottomCollision(oEarthworm, scene) {
		scene.physics.add.collider(scene.box, oEarthworm, (_, e) => {
			scene.fishDead.play();
			scene.earthwormMiss.setVisible(true);
			e.destroy();
			scene.box.setVelocity(0);
			scene.time.delayedCall(1500, () => {
				scene.earthwormMiss.setVisible(false);
			}, [], scene);
			scene.fishes.playerLives -= 1;
			if (scene.fishes.playerLives == 2) {
				scene.lifeOne.setTexture('lifeOff');
			}
			if (scene.fishes.playerLives == 1) {
				scene.lifeTwo.setTexture('lifeOff');
			}
			if (scene.fishes.playerLives == 0) {
				scene.lifeThree.setTexture('lifeOff');
				scene.player.destroy();
				scene.fishes.clearAllIntervals(); // Clear all intervals
				clearInterval(this.earthWormInterval);
				clearInterval(scene.fishes.fishInterval);
				clearInterval(scene.fishes.fishRightToLeftInterval);
				clearInterval(scene.earthWorm.earthWarmInterval);
				clearInterval(scene.submarineCartoon.submarineInterval);
				scene.gameEnding.play();
				scene.backgroundSound.loop = false;
				scene.backgroundSound.stop();
				setTimeout(() => {
					scene.scene.stop('Level');
					scene.scene.start('GameOver', scene);
				}, 2000);
			}
		}, null, scene);
	}

	earthwormTween(e, scene) {
		scene.tweens.add({
			targets: e,
			scaleX: { from: 1.0, to: 0.85 },
			duration: 500,
			yoyo: true,
			repeat: -1,
		});
	}

	randomEarthworm(s) {
		this.earthworm_ = s.physics.add.image(this.randomXPosition(), 0, this.earthwormArray[Math.floor(Math.random() * this.earthwormArray.length)]);
		this.earthworm_.scaleX = 1;
		this.earthworm_.scaleY = 1;
		this.add(this.earthworm_);
		this.earthworm_.setVelocityY(230);
		this.earthwormTween(this.earthworm_, this.scene);
		this.earthwormCollision(this.earthworm_, s);
		this.bottomCollision(this.earthworm_, s);
	}

	// New methods to start and stop the earthworm interval

	startEarthWormInterval() {
		// Start the earthworm spawning interval
		this.earthWormInterval = setInterval(() => {
			this.randomEarthworm(this.scene);
		}, 2500);
	}

	stopEarthWormInterval() {
		// Stop the earthworm spawning interval
		clearInterval(this.earthWormInterval);
	}

	// New destroy method

	destroy() {
		// Stop the earthworm spawning interval
		this.stopEarthWormInterval();

		// Destroy all earthworm objects in the container
		this.removeAll(true);

		// Remove this container from the scene
		this.scene.children.remove(this);
	}

	/* END-USER-CODE */
}
/* END OF COMPILED CODE */
