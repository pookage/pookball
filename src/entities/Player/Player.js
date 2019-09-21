import Entity from "ENTITIES/Entity/";
import DirectionIndicator from "ENTITIES/DirectionIndicator/";

export default class Player {

	#X;
	#Y;
	#SIZE = 1;
	#GAME;
	#RADIUS;
	#DEGREES_360 = Math.PI * 2;
	#CURSOR_X;
	#CURSOR_Y;
	#CHILDREN;

	constructor(config){

		const {
			game,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		// scope binding
		// -----------------------
		this.render = this.render.bind(this);
		// this.scale  = this.scale.bind(this);
		// this.rotate = this.rotate.bind(this);
		this.initChildren = this.initChildren.bind(this);
		// this.updateCursorPosition = this.updateCursorPosition.bind(this);
		// this.calculateRotationFromCursor = this.calculateRotationFromCursor.bind(this);

		// setup
		// ------------------------
		this.#X      = x;
		this.#Y      = y;
		this.#GAME   = game;
		this.#RADIUS = this.#SIZE / 2;
		this.#CHILDREN = this.initChildren();
	}// constructor
	
	initChildren(){

		const directionIndicator = new DirectionIndicator({
			game: this.#GAME,
			position: { 
				x: this.#X, 
				y: this.#Y 
			},
			size: this.#RADIUS,
			// offset: RADIUS * 1.5,
			// thickness: RADIUS / 5
		});

		return [ directionIndicator ];
	}// initChildren

	render(context){
		const x = this.#X * this.#GAME.UNIT;
		const y = this.#Y * this.#GAME.UNIT;
		const radius = this.#RADIUS * this.#GAME.UNIT;

		// console.log(this.calculateRotation, this.#CURSOR_X)
		// const rotation = this.calculateRotationFromCursor({
		// 	x: this.#CURSOR_X,
		// 	y: this.#CURSOR_Y
		// });

		context.fillStyle = "black";

		// this.rotate(context, rotation);
		context.beginPath();
		context.moveTo(x, y);
		context.arc(
			x, y,
			radius,
			0,
			this.#DEGREES_360
		);
		context.fill();

		for(let child of this.#CHILDREN){
			child.render(context);
		}

		// this.rotate(context, -rotation);
	}// render

	// rotate(context, radians){
	// 	const { x, y } = this;
	// 	context.translate(x, y)
	// 	context.rotate(radians);
	// 	context.translate(-x, -y)
	// }// rotate

	// updateCursorPosition(position){
	// 	const { x, y } = position;
	// 	this.#CURSOR_X = x;
	// 	this.#CURSOR_Y = y;
	// } // updateCursorPosition

	// calculateRotationFromCursor(cursor){
	// 	const { 
	// 		x: cursor_x = 0, 
	// 		y: cursor_y = 0 
	// 	} = cursor;

	// 	const { x, y } = this;

	// 	const dx    = cursor_x - x;
	// 	const dy    = cursor_y - y;
	// 	const angle = Math.atan2(dx, -dy);

	// 	return angle;
	// }// calculateRotationFromCursor

}// Player