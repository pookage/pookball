import Guide from "ENTITIES/Guide/";
import Goal from "ENTITIES/Goal/";
import Player from "ENTITIES/Player/";

export default class Game {

	#CANVAS           = null;
	#CONTEXT          = null;
	#WIDTH            = 1000;
	#HEIGHT           = 1000;
	#PLAYER_SCALE     = 0.1;
	#PLAYER_SIZE      = 50;
	#CENTER_X         = 500;
	#CENTER_Y         = 500;
	#ENTITIES         = [];
	#THROTTLE         = 1000;
	#THROTTLE_TIMEOUT = null;
	#NEXT_FRAME       = null;
	#CURSOR_X;
	#CURSOR_Y;

	constructor(config){
		const {
			canvas
		} = config;

		// scope binding
		this.updateSize       = this.updateSize.bind(this);
		this.scale            = this.scale.bind(this);
		this.initEntities     = this.initEntities.bind(this);
		this.render           = this.render.bind(this);
		this.requestRender    = this.requestRender.bind(this);
		this.clearRenderQueue = this.clearRenderQueue.bind(this);
		this.updateCursorPosition = this.updateCursorPosition.bind(this);

		// apply config
		this.#CANVAS  = canvas;
		this.#CONTEXT = canvas.getContext("2d");

		this.updateSize(this.#CANVAS);

		// initialise scene
		this.#ENTITIES = this.initEntities();

		this.render();
	}// constructor


	/* INIT ENTITIES
	------------------------------
		Create any child entities to be added to the scene
		*/
	initEntities(){
		//make this a private function later
		const centerYGuide = new Guide({ 
			type: "VERTICAL", 
			color: "red",
			position: { x: this.#CENTER_X },
			length: this.#HEIGHT
		});

		const centerXGuide = new Guide({
			type: "HORIZONTAL",
			color: "blue",
			position: { y: this.#CENTER_Y },
			length: this.#WIDTH
		});

		const goal = new Goal({
			playerSize: this.#PLAYER_SIZE,
			position: { x: this.#CENTER_X }
		});

		const player = new Player({
			size: this.#PLAYER_SIZE,
			position: {
				x: this.#CENTER_X,
				y: this.#CENTER_Y
			}
		});

		return ([
			centerYGuide,
			centerXGuide,
			goal,
			player
		]);
	}// initEntities


	/* UPDATE SIZE
	-----------------------------
		update everything that needs to know how big the canvas
		is - including child entities
		*/
	updateSize({ width, height }){

		// don't render anything whilst we're resizing
		this.clearRenderQueue();

		//scale positions based on the new canvas size
		this.scale({
			width: this.#WIDTH,
			height: this.#HEIGHT
		}, {
			width,
			height
		});

		// update 
		this.#WIDTH       = width;
		this.#HEIGHT      = height;
		this.#PLAYER_SIZE = height * this.#PLAYER_SCALE;
		this.#CENTER_X    = width / 2;
		this.#CENTER_Y    = height / 2;

		this.requestRender();
	}// updateSize

	/* UPDATE CURSOR POSITION
	-----------------------------
		Update game state with cursor position
		*/
	updateCursorPosition(position){
		const { x, y } = position;
		this.#CURSOR_X = x;
		this.#CURSOR_Y = y;

		for(let child of this.#ENTITIES){
			if(child.updateCursorPosition){
				child.updateCursorPosition(position);
			}
		}
	}// updateCursorPosition



	/* SCALE
	---------------------------
		whenever the canvas size updates, scale the size and
		position of all entities in the scene
		*/
	scale(prevSize, nextSize){
		for(let entity of this.#ENTITIES){
			entity.scale(prevSize, nextSize);
		}
	}// scale


	/* CLEAR RENDER QUEUE
	---------------------------
		stop any renders that have already been requested 
		*/
	clearRenderQueue(){
		clearTimeout(this.#THROTTLE_TIMEOUT);
		cancelAnimationFrame(this.#NEXT_FRAME);
	}// clearRenderQueue


	/* REQUEST RENDER
	--------------------------
		queue up another render() request in the next frame
		*/
	requestRender(){

		this.#NEXT_FRAME = requestAnimationFrame(this.render);
	} // requestRender


	/* RENDER
	--------------------------
		draw every entity in the game to the canvas
		*/
	render(){

		this.#CONTEXT.clearRect(0, 0, this.#WIDTH, this.#HEIGHT);

		// render every entity in the game scene
		for(let entity of this.#ENTITIES){
			entity.render(this.#CONTEXT);
		}

		// queue up timeout
		this.#THROTTLE_TIMEOUT = setTimeout(this.requestRender, this.#THROTTLE);
	}// render
}// Game
