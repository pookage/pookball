import DirectionIndicator from "ENTITIES/DirectionIndicator/";

export default class Player {

	#RADIUS;
	#X;
	#Y;
	#DEGREES_360 = Math.PI * 2;
	#CHILDREN = [];

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
		this.initChildEntities = this.initChildEntities.bind(this);

		this.#X      = x;
		this.#Y      = y;
		this.#RADIUS = size / 2;
		this.#CHILDREN = this.initChildEntities();
	}// constructor
	
	initChildEntities(){
		const directionIndicator = new DirectionIndicator({
			position: {
				x: this.#X,
				y: this.#Y
			},
			width: this.#RADIUS,
			offset: this.#RADIUS * 1.5,
			thickness: this.#RADIUS / 5
		});

		return [ directionIndicator ];
	}// initChildEntities

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

		for(let child of this.#CHILDREN){
			child.render(context);
		}
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

		for(let child of this.#CHILDREN){
			child.scale(prev, next);
		}
	}// scale

	updateCursorPosition({ x, y}){
		console.log({ x, y });
	} // updateCursorPosition

}// Player