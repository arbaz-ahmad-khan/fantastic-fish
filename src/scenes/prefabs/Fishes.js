class Fishes extends Phaser.GameObjects.Container {
	constructor(scene, x, y) {
		super(scene, x ?? 0, y ?? 0);

		// fish
		const fish = scene.add.image(0, 0, "Fish-1");
		this.add(fish);
		this.fish = fish;

		this.oScene = scene;
		this.bubbles = scene.add.particles("bubble-1").setDepth(10);
		this.bubbles2 = scene.add.particles("bubble-2").setDepth(10);

		this.showBubbles = (bubble, x, y) => {
			const bubbleParticles = bubble.createEmitter({
				x: { min: 0, max: 1920 },
				y: { min: 540, max: 1080 },
				speed: { min: -50, max: 50 },
				angle: { min: 0, max: 360 },
				scale: { start: 0.5, end: 1 },
				lifespan: 2500,
				gravityY: -200,
				frequency: 500,
			});
		};

		this.showBubbles(this.bubbles, 240, 1080);
		this.showBubbles(this.bubbles2, 240, 1080);

		this.playerLives = 3;
		this.fish.setVisible(false);

		this.fishData = [
			{ 'imageName': "Fish-1", 'power': 0, 'score': 7, 'setBodySizeX': 60, 'setBodySizeY': 40, 'setOffsetX': 0, 'setOffsetY': 50 },
			{ 'imageName': "Fish-2", 'power': 130, 'score': 25, 'setBodySizeX': 70, 'setBodySizeY': 50, 'setOffsetX': 0, 'setOffsetY': 50 },
			{ 'imageName': "Fish-3", 'power': 900, 'score': 50, 'setBodySizeX': 180, 'setBodySizeY': 150, 'setOffsetX': 1, 'setOffsetY': 120 },
			{ 'imageName': "Fish-4", 'power': 1500, 'score': 80, 'setBodySizeX': 170, 'setBodySizeY': 190, 'setOffsetX': 0, 'setOffsetY': 0 },
			{ 'imageName': "Fish-5", 'power': 250, 'score': 35, 'setBodySizeX': 120, 'setBodySizeY': 80, 'setOffsetX': 0, 'setOffsetY': 50 },
			{ 'imageName': "Fish-6", 'power': 0, 'score': 5, 'setBodySizeX': 50, 'setBodySizeY': 40, 'setOffsetX': 0, 'setOffsetY': 50 },
		];

		this.spawnFishTimers(scene);
	}

	fishCollision(oFish, scene) {
		scene.physics.add.collider(scene.player, oFish, (_, fish) => {
			if (scene.player.power >= fish.power) {
				scene.fishEating.play();
				scene.player.play('fishEat');
				fish.destroy();
				scene.player.power += fish.score;
				scene.plusFive.x = scene.player.x + 20;
				scene.plusFive.y = scene.player.y - 40;
				scene.plusFive.setText("+" + fish.score);
				scene.plusFive.setVisible(true);

				scene.time.delayedCall(500, () => {
					scene.plusFive.setVisible(false);
				}, [], scene);
				scene.scoreZero.setText(scene.player.power);
				scene.player.scaleX += 0.024;
				scene.player.scaleY += 0.024;
				scene.player.setVelocity(0);
			} else {
				fish.setVelocityX(fish.body.velocity.x * 3.5);
				this.playerLives -= 1;

				this.oScene.earthWorm.destroy();
				setTimeout(() => {
					// console.log("RESPAWN WORMS");
					scene.earthWorm = new EarthWorm(scene, 123, -132);
				}, 1900);

				if (this.playerLives >= 0) {
					scene.fishSkeleton.x = scene.player.x;
					scene.fishSkeleton.y = scene.player.y;
					
					scene.resetPlayerPosition();
					scene.player.setVelocity(0);
					scene.player.setVisible(false);

					scene.fishSkeleton.setVisible(true);
					scene.isPlayerAlive = false;
					scene.largerThanYou.setVisible(true);
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
				if (this.playerLives == 0) {

					if (scene.earthWorm) {
						scene.earthWorm.destroy();
					}
					
					setTimeout(() => {
						scene.player.destroy();
						// this.oScene.earthWorm.destroy();
					}, 1500);

					clearInterval(this.fishInterval);
					clearInterval(this.fishRightToLeftInterval);
					clearInterval(scene.earthWorm.earthWarmInterval);
					clearInterval(scene.submarineCartoon.submarineInterval);

					scene.gameEnding.play();
					scene.backgroundSound.loop = false;
					scene.backgroundSound.stop();
					setTimeout(() => {
						this.clearAllIntervals();
						scene.scene.stop('Level');
						scene.scene.start('GameOver', scene);
					}, 2000);
				}
			}
		}, null, scene);
	}

	RightSidefishDestroyCollision(oFish, scene) {
		scene.physics.add.overlap(scene.box1, oFish, (_, fish) => {
			fish.destroy();
		}, null, scene);
	}

	LeftSidefishDestroyCollision(oFish, scene) {
		scene.physics.add.overlap(scene.box2, oFish, (_, fish) => {
			fish.destroy();
		}, null, scene);
	}

	randomYPosition() {
		return Math.floor(Math.random() * 800) + 10;
	}

	createFish(scene, x, y, fishData) {
		if (!scene) {
			console.error("Invalid 'scene' object");
			return null; // Return early to prevent further errors
		}
		const fish = scene.physics.add.image(x, y, fishData['imageName']);
		fish.scaleX = 0.8;
		fish.scaleY = 0.8;
		fish.setBodySize(fishData['setBodySizeX'], fishData['setBodySizeY'], true, fishData['setOffsetX'], fishData['setOffsetY']);
		fish.power = fishData['power'];
		fish.score = fishData['score'];
		fish.setVelocityX(x < 0 ? 120 : -125); // Adjust velocity based on fish direction
		return fish;
	}

	fishTween(s, fish) {
		s.tweens.add({
			targets: fish,
			scaleX: { from: 0.8, to: 0.75 },
			duration: 500,
			yoyo: true,
			repeat: -1,
		});
	}

	spawnFishTimers(scene) {
		this.fishInterval = setInterval(() => {
			this.spawnRandomFish(scene);
		}, 3500);

		this.fishRightToLeftInterval = setInterval(() => {
			this.spawnRandomFish2(scene);
		}, 7000);
	}

	spawnRandomFish(scene) {
		const randomY = this.randomYPosition();
		const fishData = Phaser.Utils.Array.GetRandom(this.fishData);
		const fish = this.createFish(scene, 0, randomY, fishData);
		this.add(fish);
		this.fishTween(scene, fish);
		this.fishCollision(fish, scene);
		this.RightSidefishDestroyCollision(fish, scene);
	}

	spawnRandomFish2(scene) {
		const randomY = this.randomYPosition();
		const fishData = Phaser.Utils.Array.GetRandom(this.fishData);
		const fish = this.createFish(scene, -2500, randomY + 10, fishData);
		fish.flipX = true;
		this.add(fish);
		this.fishTween(scene, fish);
		this.fishCollision(fish, scene);
		this.LeftSidefishDestroyCollision(fish, scene);
	}

	clearAllIntervals() {
		clearInterval(this.fishInterval);
		clearInterval(this.fishRightToLeftInterval);
		// Add any other interval clearing code here
	}

}

// Usage:
// const fishes = new Fishes(scene, x, y);
// scene.add.existing(fishes);
