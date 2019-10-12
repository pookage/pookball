export default class Goal {

	#X;
	#Y;
	#GAME;
	#WIDTH = 7.32;
	#HEIGHT = 2;

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
		this.#X = x;
		this.#Y = y;
		this.#GAME = game;

	}// constructor

	render(context){

		const width  = this.#WIDTH * this.#GAME.UNIT;
		const height = this.#HEIGHT * this.#GAME.UNIT;
		const radius = width / 2;

		const xStart = (this.#X * this.#GAME.UNIT) - radius;
		const yStart = (this.#Y * this.#GAME.UNIT);

		context.fillStyle = "green";
		context.fillRect(
			xStart, yStart,
			width, height
		);
	}// render
}// Goal