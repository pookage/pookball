export default class PowerIndicator {

	// constants
	// ---------------------
	#HEIGHT = 1.5;
	#WIDTH  = 0.2;
	#GAME;

	// variables
	// ---------------------
	#x;
	#y;
	#power = 1;

	constructor(config){
		const {
			game,
			position: {
				x, y
			}
		} = config;

		this.#GAME = game;
		this.#x    = x;
		this.#y    = y;

		this.render = this.render.bind(this);
		this.update = this.update.bind(this);

	}// constructor

	update(power){
		this.#power = power;
	}// update

	updatePosition({ x, y }){
		this.#x = x;
		this.#y = y;
	}// updatePosition


	render(context, deltaTime){

		const height = (this.#HEIGHT * this.#GAME.UNIT) * this.#power; 
		const width  = this.#WIDTH * this.#GAME.UNIT;
		const x      = this.#x * this.#GAME.UNIT;
		const y      = this.#y * this.#GAME.UNIT;

		context.fillStyle = "red";
		context.fillRect(
			x, y,
			width, height
		);

		// context.fill();
	}// render



}// PowerIndicator