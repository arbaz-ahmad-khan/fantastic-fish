
// You can write more code here

/* START OF COMPILED CODE */

class StartGame extends Phaser.Scene {

	constructor() {
		super("StartGame");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// loading_background
		const loading_background = this.add.image(960, 540, "loading_background");
		loading_background.scaleX = 2.6;
		loading_background.scaleY = 2.6;

		// loading_logo
		const loading_logo = this.add.image(960, 435, "loading_logo");
		loading_logo.scaleX = 2;
		loading_logo.scaleY = 2;

		// startbtn
		const startbtn = this.add.image(963, 953, "start");

		this.startbtn = startbtn;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	startbtn;

	/* START-USER-CODE */

	// Write your code here

	create() {
		this.editorCreate();

		this.startbtn.setInteractive().on("pointerdown",()=>{
			this.scene.stop('StartGame');
			this.scene.start('Level');
		});

		// this.input.keyboard.enabled = true;
		const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  		enterKey.on('down', this.onEnterKey, this);
	}

	onEnterKey(){
		this.scene.stop('StartGame');
		this.scene.start('Level');
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
