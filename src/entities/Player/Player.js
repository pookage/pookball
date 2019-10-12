import DirectionIndicator from "ENTITIES/DirectionIndicator/";

export default class Player {

	#X;
	#Y;
	#SIZE = 1;
	#SPEED = 3;
	#GAME;
	#RADIUS;
	#DEGREES_360 = Math.PI * 2;
	#CURSOR_X;
	#CURSOR_Y;
	#CHILDREN;

	ACTIVE = true;


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
		this.rotate = this.rotate.bind(this);
		this.initChildren = this.initChildren.bind(this);
		this.calculateRotationFromCursor  = this.calculateRotationFromCursor.bind(this);
		this.calculateDirectionFromCursor = this.calculateDirectionFromCursor.bind(this);

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

	render(context, deltaTime){
		const radius = this.#RADIUS * this.#GAME.UNIT;

		// ROTATION
		// ----------------------
		// calculate rotation of the player
		const rotation = this.calculateRotationFromCursor({
			x: this.#GAME.CURSOR_X,
			y: this.#GAME.CURSOR_Y
		});

		// MOVEMENT
		// -----------------------
		// calculate direction vector
		const direction = this.calculateDirectionFromCursor({
			x: this.#GAME.CURSOR_X,
			y: this.#GAME.CURSOR_Y
		});

		// if the target is far enough away, move there
		if(direction.distance > 0.5){

			const moveX = ((direction.x * this.#SPEED)) * deltaTime;
			const moveY = ((direction.y * this.#SPEED)) * deltaTime;

			this.#X = this.#X + moveX
			this.#Y = this.#Y + moveY
		}

		// convert position to pixels for rendering
		const x = this.#X * this.#GAME.UNIT;
		const y = this.#Y * this.#GAME.UNIT;


		// DRAW
		// -------------------
		context.fillStyle = "black";

		this.rotate(context, rotation);
		context.beginPath();
		context.moveTo(x, y);
		context.arc(
			x, y,
			radius,
			0,
			this.#DEGREES_360
		);
		context.fill();

		// UPDATE CHILDREN
		// ---------------------
		for(let child of this.#CHILDREN){
			child.updatePosition({ x: this.#X, y: this.#Y });
			child.render(context, deltaTime);
		}

		// restore canvas rotation
		this.rotate(context, -rotation);
	}// render

	rotate(context, radians){
		const x = this.#X * this.#GAME.UNIT;
		const y = this.#Y * this.#GAME.UNIT;

		context.translate(x, y)
		context.rotate(radians);
		context.translate(-x, -y)
	}// rotate


	calculateRotationFromCursor(cursor){
		const { 
			x: cursor_x = 0, 
			y: cursor_y = 0 
		} = cursor;

		const x = this.#X * this.#GAME.UNIT;
		const y = this.#Y * this.#GAME.UNIT;

		const dx    = cursor_x - x;
		const dy    = cursor_y - y;
		const angle = Math.atan2(dx, -dy);

		return angle;
	}// calculateRotationFromCursor

	calculateDirectionFromCursor(cursor){

		const { 
			x: cursor_x = 0, 
			y: cursor_y = 0 
		} = cursor;

		const x = this.#X * this.#GAME.UNIT;
		const y = this.#Y * this.#GAME.UNIT;

		const xOffset      = x - cursor_x;
		const yOffset      = y - cursor_y;
		const distance     = Math.hypot(xOffset, yOffset)
		const xNormal      = -(xOffset / distance);
		const yNormal      = -(yOffset / distance);
		const distanceUnit = distance / this.#GAME.UNIT;

		const vector = {
			x: xNormal,
			y: yNormal,
			distance: distanceUnit,
		};

		console.log(distanceUnit)

		return vector;
	}// calculateDirectionFromCursor

}// Player