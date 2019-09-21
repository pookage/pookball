import Guide from "ENTITIES/Guide/";
import Goal from "ENTITIES/Goal/";
import Player from "ENTITIES/Player/";

export default class Game {

	// API HOOKS
	// --------------------------
	#CANVAS           = null; // reference to the canvas element
	#CONTEXT          = null; // refernece to the canvas' API

	// DEBUG CONTROLS
	#THROTTLE         = 1000; // (ms) minimum time between frames
	
	// PITCH DIMENSIONS
	// ---------------------------
	#WIDTH            = 45;  // width of pitch in meters
	#HEIGHT           = 90;  // length of pitch in meters

	// PLAYER DIMENSIONS
	// -----------------------------
	#PLAYER_SIZE      = 1; // radius of player in meters (should this be here?)

	// CACHED VALUES
	// ----------------------------
	#throttle_timeout = null; // reference to the setTimeout that is throttling the render
	#next_frame       = null; // refernece to the next requestAnimationFrame
	#ENTITIES         = [];   // nested tree of every entity in the game
	#cursor_x;      // last known x position of the cursor
	#cursor_y;      // last known y position of the cursor
	UNIT;           // the number of pixels per meter
	#width;         // pixel width of canvas
	#height;        // pixel height of canvas


	constructor(config){
	
		const { window } = config;

		// scope binding
		// -------------------
		this.createCanvas  = this.createCanvas.bind(this);
		this.updateUnit    = this.updateUnit.bind(this);
		this.initEntities  = this.initEntities.bind(this);
		this.render        = this.render.bind(this);
		this.requestRender = this.requestRender.bind(this);


		// setup
		// --------------------
		this.UNIT      = this.updateUnit(window);
		this.#CANVAS   = this.createCanvas();
		this.#CONTEXT  = this.#CANVAS.getContext("2d");
		this.#ENTITIES = this.initEntities();


		// begin
		// --------------------
		this.render();
	}// constructor

	updateUnit({ innerWidth, innerHeight }){

		return (innerHeight * 6) / this.#HEIGHT;
	}// updateUnit

	createCanvas(){
		const canvas  = document.createElement("canvas");
		canvas.width  = this.#width  = this.#WIDTH * this.UNIT;
		canvas.height = this.#height = this.#HEIGHT * this.UNIT;

		return canvas;
	}// createCanvas

	getCanvas(){

		return this.#CANVAS;
	}// getCanvas


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

		const goal = new Goal({
			game: this,
			position: { 
				x: this.#WIDTH / 2,
				y: 0,
			}
		});

		// const player = new Player({
		// 	size: this.#PLAYER_SIZE,
		// 	position: {
		// 		x: this.#CENTER_X + 10,
		// 		y: this.#CENTER_Y + 10
		// 	}
		// });

		return ([
			centerYGuide,
			centerXGuide,
			goal,
			// player
		]);
	}// initEntities


	/* UPDATE SIZE
	-----------------------------
		update everything that needs to know how big the canvas
		is - including child entities
		*/
	// updateSize({ width, height }){

	// 	// don't render anything whilst we're resizing
	// 	this.clearRenderQueue();

	// 	//scale positions based on the new canvas size
	// 	this.scale({
	// 		width: this.#WIDTH,
	// 		height: this.#HEIGHT
	// 	}, {
	// 		width,
	// 		height
	// 	});

	// 	// update 
	// 	this.#WIDTH       = width;
	// 	this.#HEIGHT      = height;
	// 	this.#PLAYER_SIZE = height * this.#PLAYER_SCALE;
	// 	this.#CENTER_X    = width / 2;
	// 	this.#CENTER_Y    = height / 2;

	// 	this.requestRender();
	// }// updateSize

	/* UPDATE CURSOR POSITION
	-----------------------------
		Update game state with cursor position
		*/
	// updateCursorPosition(position){
	// 	const { x, y } = position;
	// 	this.#CURSOR_X = x;
	// 	this.#CURSOR_Y = y;

	// 	for(let child of this.#ENTITIES){
	// 		if(child.updateCursorPosition){
	// 			child.updateCursorPosition(position);
	// 		}
	// 	}
	// }// updateCursorPosition



	/* SCALE
	---------------------------
		whenever the canvas size updates, scale the size and
		position of all entities in the scene
		*/
	// scale(prevSize, nextSize){
	// 	for(let entity of this.#ENTITIES){
	// 		entity.scale(prevSize, nextSize);
	// 	}
	// }// scale


	/* CLEAR RENDER QUEUE
	---------------------------
		stop any renders that have already been requested 
		*/
	// clearRenderQueue(){
	// 	clearTimeout(this.#THROTTLE_TIMEOUT);
	// 	cancelAnimationFrame(this.#NEXT_FRAME);
	// }// clearRenderQueue


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
		const widthPx  = this.#WIDTH * this.UNIT;
		const heightPx = this.#HEIGHT * this.width;
		this.#CONTEXT.clearRect(
			0, 0, 
			widthPx, heightPx
		);

		// render every entity in the game scene
		for(let entity of this.#ENTITIES){
			entity.render(this.#CONTEXT);
		}

		// queue up timeout
		this.#throttle_timeout = setTimeout(this.requestRender, this.#THROTTLE);
	}// render
}// Game
