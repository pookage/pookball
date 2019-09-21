export default class DirectionIndicator {

	#X;
	#Y;
	#RADIUS;
	#HEIGHT;
	#OFFSET;
	#THICKNESS = 10;
	#GAME;

	constructor(config){
		const {
			game,
			position: {
				x = 0,
				y = 0
			},
			size,
		} = config;

		console.log(size)

		this.#GAME      = game;
		this.#X         = x;
		this.#Y         = y;
		this.#RADIUS    = size / 2;
		this.#HEIGHT    = size / 2;
		this.#THICKNESS = size / 5;
		this.#OFFSET    = size * 1.5;

		this.render = this.render.bind(this);
	}// constructor

	render(context){

		const thickness = this.#THICKNESS * this.#GAME.UNIT;
		const x = this.#X * this.#GAME.UNIT;
		const y = this.#Y * this.#GAME.UNIT;
		const radius = this.#RADIUS * this.#GAME.UNIT;
		const offset = this.#OFFSET * this.#GAME.UNIT;
		const height = this.#HEIGHT * this.#GAME.UNIT;

		// direction indicator
		context.strokeStyle = "black";
		context.lineWidth   = thickness;
		context.beginPath();
		context.moveTo(
			x - radius, 
			y - offset,
		);
		context.lineTo(
			x, 
			y - (offset + height)
		);
		context.lineTo(
			x + radius, 
			y - offset
		);
		context.stroke();
	}// render
}