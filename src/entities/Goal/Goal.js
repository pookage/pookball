import { getCollisionVector, set } from "SHARED/utils.js";

export default class Goal {

	X;
	Y;
	#GAME;
	WIDTH = 7.32;
	HEIGHT = 2;
	#state;

	constructor(config){
		const { 
			game,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		// scope binding
		this.render = this.render.bind(this);
		this.update = this.update.bind(this);

		// setup
		this.X = x;
		this.Y = y;
		this.#GAME = game;

		this.#state = new Proxy(
			{ scored: false },
			{ set: set.bind(true, this.update) }
		);

	}// constructor

	render(context){

		const { UNIT, BALL } = this.#GAME;

		const width  = this.WIDTH * UNIT;
		const height = this.HEIGHT * UNIT;
		const radius = width / 2;

		const xStart = (this.X * UNIT) - radius;
		const yStart = (this.Y * UNIT);

		context.fillStyle = "green";
		context.fillRect(
			xStart, yStart,
			width, height
		);

		// COLLISION DETECTION
		// -------------------------
		const collisionVector = getCollisionVector(this, BALL);
		if(collisionVector) this.#state.scored = true;
	}// render


	update(key, val, prev){
		switch(key){
			case "scored":
				this.#GAME.scoreGoal();
				break;
		}
	}// update

}// Goal