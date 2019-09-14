export default class Player {

	#RADIUS;
	#X;
	#Y;
	#DEGREES_360 = Math.PI * 2;

	constructor(config){

		const {
			size,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		// scope binding
		this.render = this.render.bind(this);
		this.scale  = this.scale.bind(this);

		this.#X      = x;
		this.#Y      = y;
		this.#RADIUS = size / 2;
	}// constructor

	render(context){
		context.fillStyle = "black";

		context.beginPath();
		context.moveTo(this.#X, this.#Y);
		context.arc(
			this.#X, this.#Y,
			this.#RADIUS,
			0,
			this.#DEGREES_360
		);
		context.fill();
	}// render

	scale(prev, next){
		const { width: prevWidth, height: prevHeight } = prev;
		const { width: nextWidth, height: nextHeight } = next;

		const scalars = {
			x: this.#X / prevWidth,
			y: this.#Y / prevHeight,
			radius: this.#RADIUS / prevWidth
		};

		this.#X      = scalars.x * nextWidth;
		this.#Y      = scalars.y * nextHeight;
		this.#RADIUS = scalars.radius * nextWidth;
	}// scale

}// Player