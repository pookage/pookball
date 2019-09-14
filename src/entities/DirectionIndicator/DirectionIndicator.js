export default class DirectionIndicator {

	#X;
	#Y;
	#RADIUS;
	#HEIGHT;
	#OFFSET;
	#THICKNESS = 10;

	constructor(config){
		const {
			position: {
				x = 0,
				y = 0
			},
			width = 1,
			offset,
			thickness = this.#THICKNESS
		} = config;

		this.#X         = x;
		this.#Y         = y;
		this.#RADIUS    = width / 2;
		this.#HEIGHT    = width / 2;
		this.#THICKNESS = thickness;
		this.#OFFSET    = offset;

		this.render = this.render.bind(this);
		this.scale  = this.scale.bind(this);
	}// constructor

	render(context){
		// direction indicator
		context.strokeStyle = "black";
		context.lineWidth   = this.#THICKNESS;
		context.beginPath();
		context.moveTo(
			this.#X - this.#RADIUS, 
			this.#Y - this.#OFFSET,
		);
		context.lineTo(
			this.#X, 
			this.#Y - (this.#OFFSET + this.#HEIGHT)
		);
		context.lineTo(
			this.#X + this.#RADIUS, 
			this.#Y - this.#OFFSET
		);
		context.stroke();
	}// render

	scale(prev, next){
		const { width: prevWidth, height: prevHeight } = prev;
		const { width: nextWidth, height: nextHeight } = next;

		const scalars = {
			x: this.#X / prevWidth,
			y: this.#Y / prevHeight,
			radius: this.#RADIUS / prevWidth,
			height: this.#HEIGHT / prevWidth,
			offset: this.#OFFSET / prevWidth,
			thickness: this.#THICKNESS / prevWidth
		};

		this.#X         = scalars.x * nextWidth;
		this.#Y         = scalars.y * nextHeight;
		this.#RADIUS    = scalars.radius * nextWidth;
		this.#HEIGHT    = scalars.height * nextWidth;
		this.#OFFSET    = scalars.offset * nextWidth;
		this.#THICKNESS = scalars.thickness * nextWidth;
	}// scale

}