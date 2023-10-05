
// You can write more code here

/* START OF COMPILED CODE */

class SubmarineCartoon extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 0, y ?? 0);

		// submarine
		const submarine = scene.add.image(0, 0, "Submarine");
		this.add(submarine);

		this.submarine = submarine;
		this.oScene = scene;

		/* START-USER-CTR-CODE */
		// Write your code here.
		this.submarineInterval = setInterval(() => {
			this.randomSubmarine(scene);
		}, 20000);
		/* END-USER-CTR-CODE */
	}

	/** @type {Phaser.GameObjects.Image} */
	submarine;

	/* START-USER-CODE */

	submarineCollision(oSubmarine, scene) {
		scene.physics.add.collider(scene.player, oSubmarine, (_) => {
			scene.fishes.playerLives -= 1;
			oSubmarine.setVelocityX(oSubmarine.body.velocity.x * 3.5);
			this.oScene.earthWorm.destroy();
			setTimeout(() => {
				// console.log("RESPAWN WORMS");
				scene.earthWorm = new EarthWorm(scene, 123, -132);
			}, 1900);
			if (scene.fishes.playerLives >= 0) {
				scene.fishSkeleton.x = scene.player.x;
				scene.fishSkeleton.y = scene.player.y;
				scene.resetPlayerPosition();
				scene.player.setVelocity(0);
				scene.player.setVisible(false);
				scene.fishSkeleton.setVisible(true);
				scene.isPlayerAlive = false;
				scene.largerThanYou.setVisible(true)
				scene.time.delayedCall(1500, () => {
					scene.largerThanYou.setVisible(false);
				}, [], scene);
				scene.fishDead.play();
				scene.fishSkeleton.setScale(scene.player.scaleX, scene.player.scaleY);
				scene.fishSkeleton.play('fishDead').on('animationcomplete', () => {
					scene.isPlayerAlive = true;
				});
				scene.time.delayedCall(1500, () => {
					scene.fishSkeleton.setVisible(false);
					scene.player.setVisible(true);
				}, [], scene);
			}
			if (scene.fishes.playerLives == 0) {
				// scene.largerThanYou.setVisible(true);
				if (scene.earthWorm) {
					scene.earthWorm.destroy();
				}
				setTimeout(() => {
					scene.player.destroy();
					// this.oScene.earthWorm.destroy();
				}, 1500);

				clearInterval(this.submarineInterval);
				clearInterval(scene.fishes.fishInterval);
				clearInterval(scene.fishes.fishRightToLeftInterval);
				clearInterval(scene.earthWorm.earthWarmInterval);
				scene.backgroundSound.stop();
				setTimeout(() => {
					// scene.fishes.clearAllIntervals();
					this.oScene.earthWorm.destroy();
					scene.scene.stop('Level');
					scene.scene.start('GameOver', scene);
				}, 2000);
			}

		}, null, scene)
	}

	randomYPosition() {
		return Math.floor(Math.random() * 751) + 200;
	}

	randomSubmarine(s) {
		const randomY = this.randomYPosition();
		// const minY = 200; // Minimum Y-axis position
		// const maxY = 950; // Maximum Y-axis position
		// const randomY = Phaser.Math.Between(minY, maxY);

		this.submarine_ = s.physics.add.image(0, randomY, 'Submarine');
		this.submarine_.setBodySize(300, 100, true);
		this.submarine_.setOffset(50, 150);
		this.add(this.submarine_);
		this.submarine_.setVelocityX(-100);
		this.submarineCollision(this.submarine_, s);
	}

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
