import { easeInOut } from "SHARED/utils.js";

export default class Ball {

	X;
	Y;
	direction = { x: 0, y: 0 }; // current direction vector of travel
	#energy = 0;    // amount of distance the ball has left to travel

	// constants
	RADIUS;
	#GAME;
	#MULTIPLIER__SHORT = 2;
	#MULTIPLIER__LONG  = 2.5;

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
		this.render = this.render.bind(this);
		this.kick   = this.kick.bind(this);

		// setup
		// ---------------------
		this.X    = x;
		this.Y    = y;
		this.#GAME = game;
		this.RADIUS = size / 2;
	}// constructor

	render(context, deltaTime){

		// MOVEMENT
		// -------------------------
		const speed = this.#energy = easeInOut(this.#energy, 0, 0, 0.05);
		const moveX = ((this.direction.x * speed)) * deltaTime;
		const moveY = ((this.direction.y * speed)) * deltaTime;

		this.X = this.X + moveX;
		this.Y = this.Y + moveY;

		const x      = this.X * this.#GAME.UNIT;
		const y      = this.Y * this.#GAME.UNIT;
		const radius = this.RADIUS * this.#GAME.UNIT;

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

	dribble(direction, power){
		const { x, y } = direction;

		this.direction = { x, y };
		this.#energy   = this.#MULTIPLIER__SHORT * power;
	}// dribble

	kick(direction, power){
		const { x, y } = direction;

		this.direction = { x, y };
		this.#energy   = this.#MULTIPLIER__LONG * power;
	}// kick

}// Ball