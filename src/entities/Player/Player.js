import DirectionIndicator from "ENTITIES/DirectionIndicator/";

export default class Player {

	#X;
	#Y;
	#SIZE = 1;

	#SPEED_THRESHOLD__WALK = 2;
	#SPEED_THRESHOLD__JOG  = 5;

	#SPEED__WALK = 2;
	#SPEED__JOG  = 4;
	#SPEED__RUN  = 6;
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
		this.calculateSpeedFromDistance   = this.calculateSpeedFromDistance.bind(this);

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

		const speed = this.calculateSpeedFromDistance(direction.distance);
		const moveX = ((direction.x * speed)) * deltaTime;
		const moveY = ((direction.y * speed)) * deltaTime;

		this.#X = this.#X + moveX
		this.#Y = this.#Y + moveY

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

		// direction vector
		if(this.#GAME.DEBUG){
			context.beginPath();
			context.strokeStyle = "#FF0000";
			context.lineWidth = 1;
			context.moveTo(x, y);
			context.lineTo(
				this.#GAME.CURSOR_X, 
				this.#GAME.CURSOR_Y
			);
			context.stroke();
			context.strokeStyle = "black";
		}
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

		const xOffset      = x - cursor_x; //(cursor_x + (this.#RADIUS * this.#GAME.UNIT));
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

		return vector;
	}// calculateDirectionFromCursor

	calculateSpeedFromDistance(distance){

		const on    = distance < this.#RADIUS;
		const close = distance < this.#SPEED_THRESHOLD__WALK;
		const near  = distance < this.#SPEED_THRESHOLD__JOG;
		const far   = distance >= this.#SPEED_THRESHOLD__JOG;

		if(on)         return 0;
		else if(close) return this.#SPEED__WALK;
		else if(near)  return this.#SPEED__JOG;
		else if(far)   return this.#SPEED__RUN;
	}// distance

}// Player