export default class ProximityIndicator {

	X;
	Y;
	#GAME;
	RADIUS;

	#THICKNESS = 0.01;

	constructor(config){
		const {
			game,
			position: {
				x = 0,
				y = 0
			},
			radius,
		} = config;

		this.#GAME      = game;
		this.X         = x;
		this.Y         = y;
		this.RADIUS    = radius;

		this.render = this.render.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
	}// constructor

	render(context, deltaTime){
		const x = this.X * this.#GAME.UNIT;
		const y = this.Y * this.#GAME.UNIT;
		const thickness = this.#THICKNESS * this.#GAME.UNIT;
		const radius = this.RADIUS * this.#GAME.UNIT;

		context.strokeStyle = "black";
		context.lineWidth   = thickness;
		
		context.moveTo(x, y);
		context.beginPath();
		context.arc(
			x, y,
			radius,
			0,
			this.#GAME.DEGREES_360
		);

		context.stroke();
	}// render

	updatePosition({ x, y }){
		this.X = x;
		this.Y = y;
	}// updatePosition
}