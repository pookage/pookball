export default class Ball {

	#X;
	#Y;
	#RADIUS;
	#GAME;

	// defaults
	#SIZE = 0.5;

	constructor(config){
		const {
			game,
			size = this.#SIZE,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		// scope binding
		// --------------------


		// setup
		// ---------------------
		this.#X    = x;
		this.#Y    = y;
		this.#GAME = game;
		this.#RADIUS = size / 2;
	}// constructor

	render(context, deltaTime){

		const x      = this.#X * this.#GAME.UNIT;
		const y      = this.#Y * this.#GAME.UNIT;
		const radius = this.#RADIUS * this.#GAME.UNIT;

		// DRAW
		// -------------------------
		context.fillStyle = "red";

		context.beginPath();
		context.moveTo(x, y);
		context.arc(
			x, y,
			radius,
			0,
			this.#GAME.DEGREES_360
		);
		context.fill();
	}// render

	updatePosition({ x, y }){
		this.#X = x;
		this.#Y = y;
	}// updatePosition

}// Ball