import DirectionIndicator from "ENTITIES/DirectionIndicator/";
import ProximityIndicator from "ENTITIES/ProximityIndicator/";
import { easeInOut, getCollisionVector } from "SHARED/utils.js";

export default class Player {

	X;
	Y;
	RADIUS;

	#SPEED_THRESHOLD__WALK = 2;
	#SPEED_THRESHOLD__JOG  = 7;

	#SIZE = 1;
	#ACCELERATION = 0.1;
	#DECELLERATION = 0.075;
	#SPEED__WALK = 2;
	#SPEED__JOG  = 4;
	#SPEED__RUN  = 8;
	#POWER__DRIBBLE = 1;
	#POWER__KICKING = 1;

	#GAME;	
	#CURSOR_X;
	#CURSOR_Y;
	#CHILDREN;

	ACTIVE = true;

	direction = { x: 0, y: 0 }; // current movement direction vector
	speed     = 0;


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
		this.attachMouseControls          = this.attachMouseControls.bind(this);
		this.punt                         = this.punt.bind(this);
		this.dribble                      = this.dribble.bind(this);

		// setup
		// ------------------------
		this.X      = x;
		this.Y      = y;
		this.#GAME  = game;
		this.RADIUS = this.#SIZE / 2;
		this.#CHILDREN = this.initChildren();

		this.attachMouseControls();
	}// constructor
	
	initChildren(){

		const options = {
			game: this.#GAME,
			position: { 
				x: this.X, 
				y: this.Y 
			}
		};
		const walk = new DirectionIndicator({
			...options,
			size: this.RADIUS,
			parent: this,
			offset: 0,
			threshold: 0,
		});
		const jog = new DirectionIndicator({
			...options,
			size: this.RADIUS,
			parent: this,
			offset: 0.2,
			threshold: this.#SPEED__WALK,
		});
		const run = new DirectionIndicator({
			...options,
			size: this.RADIUS,
			parent: this,
			offset: 0.4,
			threshold: this.#SPEED__JOG
		});

		const close = new ProximityIndicator({
			...options,
			radius: this.#SPEED_THRESHOLD__WALK
		});

		const near = new ProximityIndicator({
			...options,
			radius: this.#SPEED_THRESHOLD__JOG
		});


		return [
			walk,
			jog,
			run,
			close,
			near
		];
	}// initChildren

	attachMouseControls(){
		window.addEventListener("click", this.punt);
	}// attachMouseControls


	render(context, deltaTime){
		const radius = this.RADIUS * this.#GAME.UNIT;

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
		const direction = this.direction = this.calculateDirectionFromCursor({
			x: this.#GAME.CURSOR_X,
			y: this.#GAME.CURSOR_Y
		});

		const targetSpeed = this.calculateSpeedFromDistance(direction.distance);
		const speed = this.speed = easeInOut(this.speed, targetSpeed, this.#ACCELERATION, this.#DECELLERATION);
		const moveX = ((direction.x * speed)) * deltaTime;
		const moveY = ((direction.y * speed)) * deltaTime;

		this.X = this.X + moveX
		this.Y = this.Y + moveY

		// convert position to pixels for rendering
		const x = this.X * this.#GAME.UNIT;
		const y = this.Y * this.#GAME.UNIT;


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
			this.#GAME.DEGREES_360
		);
		context.fill();

		// UPDATE CHILDREN
		// ---------------------
		for(let child of this.#CHILDREN){
			child.updatePosition({ x: this.X, y: this.Y });
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


		// COLLISION EFFECTS
		// ------------------------
		const ballCollision = getCollisionVector(this, this.#GAME.BALL);
		if(ballCollision){
			this.dribble();
		}
	}// render

	rotate(context, radians){
		const x = this.X * this.#GAME.UNIT;
		const y = this.Y * this.#GAME.UNIT;

		context.translate(x, y)
		context.rotate(radians);
		context.translate(-x, -y)
	}// rotate


	calculateRotationFromCursor(cursor){
		const { 
			x: cursor_x = 0, 
			y: cursor_y = 0 
		} = cursor;

		const x = this.X * this.#GAME.UNIT;
		const y = this.Y * this.#GAME.UNIT;

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

		const x = this.X * this.#GAME.UNIT;
		const y = this.Y * this.#GAME.UNIT;

		const xOffset      = x - cursor_x;
		const yOffset      = y - cursor_y;
		const distance     = Math.hypot(xOffset, yOffset);
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

		const on    = distance < this.RADIUS;
		const close = distance < this.#SPEED_THRESHOLD__WALK;
		const near  = distance < this.#SPEED_THRESHOLD__JOG;
		const far   = distance >= this.#SPEED_THRESHOLD__JOG;

		if(on)         return 0;
		else if(close) return this.#SPEED__WALK;
		else if(near)  return this.#SPEED__JOG;
		else if(far)   return this.#SPEED__RUN;
	}// distance

	dribble(){
		const scalar = Math.max(1 - (this.speed / this.#SPEED__RUN), 0.8);
		const power  = (this.#POWER__DRIBBLE * this.speed) * scalar;

		this.#GAME.BALL.dribble(this.direction, power);
	}

	punt(){
		if(this.ACTIVE){
			const { X: ballX, Y: ballY } = this.#GAME.BALL;
			const xOffset      = this.X - ballX;
			const yOffset      = this.Y - ballY;
			const distance     = Math.hypot(xOffset, yOffset)

			const ballNear = distance < this.#SPEED__WALK; // TODO - only allow this if ball is at feet
			if(ballNear){
				const scalar = Math.max(1 - (this.speed / this.#SPEED__RUN), 0.4);
				const power  = (this.#POWER__KICKING * this.speed) * scalar;
				this.#GAME.BALL.kick(this.direction, power);
			}
		}
	}// punt

}// Player