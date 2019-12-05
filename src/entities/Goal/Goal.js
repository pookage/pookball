import { getCollisionVector } from "SHARED/utils.js";

export default class Goal {

	X;
	Y;
	#GAME;
	WIDTH = 7.32;
	HEIGHT = 2;

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

		// setup
		this.X = x;
		this.Y = y;
		this.#GAME = game;

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
		// console.log({ collisionVector})
		if(collisionVector){
			// console.log("goal!");
			this.#GAME.scoreGoal();
		}
	}// render
}// Goal