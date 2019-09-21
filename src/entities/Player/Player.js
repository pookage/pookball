import Entity from "ENTITIES/Entity/";
import DirectionIndicator from "ENTITIES/DirectionIndicator/";

export default class Player extends Entity {

	RADIUS;
	#DEGREES_360 = Math.PI * 2;
	#CURSOR_X;
	#CURSOR_Y;

	constructor(config){

		super(config);

		const {
			size,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		// scope binding
		this.scale  = this.scale.bind(this);
		this.updateCursorPosition = this.updateCursorPosition.bind(this);
		this.rotate = this.rotate.bind(this);
		this.initChildren = this.initChildren.bind(this);
		this.calculateRotationFromCursor = this.calculateRotationFromCursor.bind(this);
		this.RADIUS = size / 2;
		this.CHILDREN = this.initChildren();
		console.log(this)
	}// constructor
	
	initChildren(){

		const { x, y, RADIUS } = this;
		const directionIndicator = new DirectionIndicator({
			position: { x, y },
			width: RADIUS,
			offset: RADIUS * 1.5,
			thickness: RADIUS / 5
		});

		return [ directionIndicator ];
	}// initChildren

	render(context){

		const {
			x, y,
			RADIUS,
		} = this;



		// console.log(this.calculateRotation, this.#CURSOR_X)
		const rotation = this.calculateRotationFromCursor({
			x: this.#CURSOR_X,
			y: this.#CURSOR_Y
		});

		context.fillStyle = "black";

		this.rotate(context, rotation);
		context.beginPath();
		context.moveTo(x, y);
		context.arc(
			x, y,
			RADIUS,
			0,
			this.#DEGREES_360
		);
		context.fill();
		
		super.render(context);

		this.rotate(context, -rotation);
	}// render

	scale(prev, next){
		const { width: prevWidth, height: prevHeight } = prev;
		const { width: nextWidth, height: nextHeight } = next;
		const {
			x, y,
			RADIUS,
			CHILDREN
		} = this;

		const scalars = {
			x: x / prevWidth,
			y: y / prevHeight,
			radius: RADIUS / prevWidth
		};

		this.x      = scalars.x * nextWidth;
		this.y      = scalars.y * nextHeight;
		this.RADIUS = scalars.radius * nextWidth;

		for(let child of CHILDREN){
			child.scale(prev, next);
		}
	}// scale

	rotate(context, radians){
		const { x, y } = this;
		context.translate(x, y)
		context.rotate(radians);
		context.translate(-x, -y)
	}// rotate

	updateCursorPosition(position){
		const { x, y } = position;
		this.#CURSOR_X = x;
		this.#CURSOR_Y = y;
	} // updateCursorPosition

	calculateRotationFromCursor(cursor){
		const { 
			x: cursor_x = 0, 
			y: cursor_y = 0 
		} = cursor;

		const { x, y } = this;

		const dx    = cursor_x - x;
		const dy    = cursor_y - y;
		const angle = Math.atan2(dx, -dy);

		return angle;
	}// calculateRotationFromCursor

}// Player