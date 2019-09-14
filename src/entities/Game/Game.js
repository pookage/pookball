import Guide from "ENTITIES/Guide/";

export default class Game {

	#CANVAS           = null;
	#CONTEXT          = null;
	#WIDTH            = 1000;
	#HEIGHT           = 1000;
	#PLAYER_SCALE     = 0.05;
	#PLAYER_SIZE      = 50;
	#CENTER_X         = 500;
	#CENTER_Y         = 500;
	#ENTITIES         = [];
	#THROTTLE         = 5000;
	#THROTTLE_TIMEOUT = null;
	#NEXT_FRAME       = null;

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

		return ([
			centerYGuide,
			centerXGuide
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

		// render every entity in the game scene
		for(let entity of this.#ENTITIES){
			entity.render(this.#CONTEXT);
		}

		// queue up timeout
		this.#THROTTLE_TIMEOUT = setTimeout(this.requestRender, this.#THROTTLE);
	}// render
}// Game
