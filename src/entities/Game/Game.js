import Guide from "ENTITIES/Guide/";
import Goal from "ENTITIES/Goal/";
import Player from "ENTITIES/Player/";
import Ball from "ENTITIES/Ball/";
import { debounce, calculateScroll, set } from "SHARED/utils.js";

export default class Game {

	// API HOOKS
	// --------------------------
	#CANVAS           = null; // reference to the canvas element
	#CONTEXT          = null; // refernece to the canvas' API

	// DEBUG CONTROLS
	DEBUG                = true; // whether to show debug controls / visuals
	#FPS_LOCK            = 90;   // maximum frames-per-seconds
	#THROTTLE            = 1000 / this.#FPS_LOCK; // (ms) minimum time between frames
	#DISABLE_SCROLL      = false;
	#DISABLE_CURSOR_LOCK = true;
	
	// PITCH DIMENSIONS
	// ---------------------------
	#WIDTH            = 45;  // width of pitch in meters
	#HEIGHT           = 90;  // length of pitch in meters

	// CACHED VALUES
	// ----------------------------
	#TEAMS            = [ "Top Peeps", "Bottom Peeps" ]; 
	DEGREES_360       = Math.PI * 2;
	#throttle_timeout = null;       // reference to the setTimeout that is throttling the render
	#next_frame       = null;       // refernece to the next requestAnimationFrame
	#ENTITIES         = [];         // nested tree of every entity in the game
	#last_tick        = Date.now(); // time of previous tick
	#SCROLL_SPEED     = 400;        // speed at which to scroll the window
	CURSOR_X;          // last known absolute x position of the cursor
	CURSOR_Y;          // last known absolute y position of the cursor
	WINDOW_X;          // last known relative x position of the cursor
	WINDOW_Y;          // last known relative y position of the cursor
	ACTIVE_PLAYER;
	BALL;
	UNIT;            // the number of pixels per meter
	#width;          // pixel width of canvas
	#height;         // pixel height of canvas
	#state;


	constructor(config){
	
		const { window } = config;

		// scope binding
		// -------------------
		this.createCanvas  = this.createCanvas.bind(this);
		this.updateUnit    = this.updateUnit.bind(this);
		this.update        = this.update.bind(this);
		this.initEntities  = this.initEntities.bind(this);
		this.render        = this.render.bind(this);
		this.requestRender = this.requestRender.bind(this);
		this.updateCursorPosition = this.updateCursorPosition.bind(this);
		this.requestCursorUpdate = this.requestCursorUpdate.bind(this);
		this.updateUnitOnResize = this.updateUnitOnResize.bind(this);
		this.constrainCursor = this.constrainCursor.bind(this);
		this.pauseOnInactive = this.pauseOnInactive.bind(this);
		this.pause = this.pause.bind(this);
		this.resume = this.resume.bind(this);
		this.centerOnActive = this.centerOnActive.bind(this);
		this.attachKeyboardControls = this.attachKeyboardControls.bind(this);
		this.scoreGoal = this.scoreGoal.bind(this);
		this.resetBall = this.resetBall.bind(this);


		// setup
		// --------------------
		this.UNIT      = this.updateUnit(window);
		this.#CANVAS   = this.createCanvas();
		this.#CONTEXT  = this.#CANVAS.getContext("2d");
		this.#ENTITIES = this.initEntities();
		this.#state    = {
			scores: new Proxy(
				{
					[this.#TEAMS[0]]: 0,
					[this.#TEAMS[1]]: 0
				},
				{ set: set.bind(true, this.update) }
			)
		};


		// begin
		// --------------------
		this.attachKeyboardControls();
		this.updateUnitOnResize();
		this.pauseOnInactive();
		this.render();
		this.pause();

		setTimeout(this.centerOnActive, 0);
	}// constructor

	updateUnit({ innerWidth, innerHeight }){

		return (innerHeight * 6) / this.#HEIGHT;
	}// updateUnit

	update(key, val, prev){

		console.log(key, "goal scored, new state: ", this.#state.scores);

		switch(key){
			case this.#TEAMS[0]:
			case this.#TEAMS[1]:
				this.resetBall();
				break;
			default:
				return;
		}
	}// update


	createCanvas(){
		const canvas  = document.createElement("canvas");
		canvas.width  = this.#width  = this.#WIDTH * this.UNIT;
		canvas.height = this.#height = this.#HEIGHT * this.UNIT;

		canvas.addEventListener("mousemove", this.requestCursorUpdate);
		canvas.addEventListener("click", this.constrainCursor);

		return canvas;
	}// createCanvas

	getCanvas(){

		return this.#CANVAS;
	}// getCanvas

	getSize(){
		return {
			width: this.#WIDTH,
			height: this.#HEIGHT
		};
	}// getSize

	attachKeyboardControls(){

		const parseKeyUp = ({ code }) => {
			switch(code){
				case "Space":
					if(this.#next_frame) this.pause();
					else                 this.resume();
					break;
			}
		}// parseKeyUp

		window.addEventListener("keyup", parseKeyUp);
	}// attachKeyboardControls

	updateUnitOnResize(){

		window.addEventListener("resize", this.updateUnit);
	}// updateUnitOnResize

	pauseOnInactive(){
		window.addEventListener("blur", this.pause);
		// window.addEventListener("focus", this.resume);
	}// pauseOnInactive

	centerOnActive(){
		const { X, Y } = this.ACTIVE_PLAYER;
		const { innerWidth, innerHeight } = window;
		const x = (X * this.UNIT) - (innerWidth / 2);
		const y = (Y * this.UNIT) - (innerHeight / 2);

		window.scrollTo(x, y);
	}// centerOnActive


	pause(){
		cancelAnimationFrame(this.#next_frame);
		clearTimeout(this.#throttle_timeout);
		this.#next_frame = null;
	}// pause
	resume(){
		this.#last_tick = Date.now();
		this.requestRender();
	}// resume


	// RULES LOGIC
	// ---------------------------
	scoreGoal(team){
		this.#state.scores[team] = this.#state.scores[team] + 1;
	}// scoreGoal

	resetBall(){
		console.log("reset teh ball!")
		this.BALL.reset({
			x: this.#WIDTH / 2,
			y: this.#HEIGHT / 2
		})
	}// resetBall


	/* INIT ENTITIES
	------------------------------
		Create any child entities to be added to the scene
		*/
	initEntities(){
		//make this a private function later
		const centerYGuide = new Guide({
			game: this,
			type: "VERTICAL", 
			color: "red",
			position: { x: this.#WIDTH / 2 },
			length: this.#HEIGHT
		});

		const centerXGuide = new Guide({
			game: this,
			type: "HORIZONTAL",
			color: "blue",
			position: { y: this.#HEIGHT / 2 },
			length: this.#WIDTH
		});

		const topGoal = new Goal({
			team: this.#TEAMS[0],
			game: this,
			position: { 
				x: this.#WIDTH / 2,
				y: 0,
			}
		});

		const bottomGoal = new Goal({
			team: this.#TEAMS[1],
			game: this,
			position: { 
				x: this.#WIDTH / 2,
				y: this.#HEIGHT - 2,
			}
		});

		const player = this.ACTIVE_PLAYER = new Player({
			game: this,
			position: {
				x: this.#WIDTH / 2,
				y: 9
			}
		});

		const ball = this.BALL = new Ball({
			game: this,
			position: {
				x: this.#WIDTH / 2,
				y: this.#HEIGHT / 2
			}
		});

		return ([
			centerYGuide,
			centerXGuide,
			topGoal,
			bottomGoal,
			player,
			ball
		]);
	}// initEntities


	/* UPDATE CURSOR POSITION
	-----------------------------
		Update game state with cursor position
		*/
	requestCursorUpdate(event){
		debounce(this.updateCursorPosition.bind(true, event), 60, "GAME_CURSOR");
	}//requestCursorUpdate
	updateCursorPosition(event){
		const { 
			offsetX, offsetY,     // absolute position on canvas
			clientX, clientY,     // absolute position on window
			movementX, movementY, // relative change since last event
		} = event; // need absolute for player

		this.CURSOR_X = offsetX;
		this.CURSOR_Y = offsetY;
		this.WINDOW_X = clientX;
		this.WINDOW_Y = clientY;
	}// updateCursorPosition
	constrainCursor(){
		if(!this.#DISABLE_CURSOR_LOCK){
			this.#CANVAS.requestPointerLock();
		}
	}// constainCurosr


	/* REQUEST RENDER
	--------------------------
		queue up another render() request in the next frame
		*/
	requestRender(){

		this.#next_frame = requestAnimationFrame(this.render);
	} // requestRender


	/* RENDER
	--------------------------
		draw every entity in the game to the canvas
		*/
	render(){
		const now       = Date.now();
		const deltaTime = (now - this.#last_tick) / 1000;
		const canvas    = this.getCanvas();
		
		const cursor    = { x: this.WINDOW_X, y: this.WINDOW_Y };
		const scroll    = calculateScroll(cursor, canvas, this.#SCROLL_SPEED, deltaTime);

		const widthPx   = this.#WIDTH * this.UNIT;
		const heightPx  = this.#HEIGHT * this.UNIT;

		this.#CONTEXT.clearRect(
			0, 0, 
			widthPx, heightPx
		);

		if(!this.#DISABLE_SCROLL){
			// scroll window
			window.scrollTo(scroll.x, scroll.y);

			// keep cursor position in sync with window scroll
			if(this.CURSOR_X && this.CURSOR_Y){
				this.CURSOR_X += scroll.stepX;
				this.CURSOR_Y += scroll.stepY;
				this.WINDOW_X += scroll.stepX;
				this.WINDOW_Y += scroll.stepY;
			}
		}

		// render every entity in the game scene
		for(let entity of this.#ENTITIES){
			entity.render(this.#CONTEXT, deltaTime);
		}

		// queue up timeout
		this.#throttle_timeout = setTimeout(this.requestRender, this.#THROTTLE);

		this.#last_tick = Date.now();
	}// render
}// Game
