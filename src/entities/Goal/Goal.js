export default class Goal {

	#X_START;
	#Y_START;
	#WIDTH;
	#HEIGHT;

	constructor(config){
		const { 
			playerSize,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		const width  = playerSize * 10;
		const radius = width * 0.5;
		const height = width * 0.05

		this.#X_START = x - radius;
		this.#Y_START = y;
		this.#WIDTH   = width;
		this.#HEIGHT  = height;

		this.render = this.render.bind(this);
		this.scale = this.scale.bind(this);
	}// constructor

	render(context){
		context.fillStyle = "green";
		context.fillRect(
			this.#X_START, this.#Y_START,
			this.#WIDTH, this.#HEIGHT
		);
	}// render

	scale(prev, next){

		const { width: prevWidth, height: prevHeight } = prev;
		const { width: nextWidth, height: nextHeight } = next;

		const scalars = {
			x: this.#X_START / prevWidth,
			y: this.#Y_START / prevHeight,
			width: this.#WIDTH / prevWidth,
			height: this.#HEIGHT / prevHeight
		};

		this.#X_START = scalars.x * nextWidth;
		this.#Y_START = scalars.y * nextHeight;
		this.#WIDTH = scalars.width * nextWidth;
		this.#HEIGHT = scalars.height * nextHeight;
	}// scale

}// Goal