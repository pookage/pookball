import { getCollisionVector, set } from "SHARED/utils.js";

export default class Goal {

	X;
	Y;
	#GAME;
	WIDTH = 7.32;
	HEIGHT = 2;
	#TEAM;
	#state;

	constructor(config){
		const { 
			game,
			team,
			position: {
				x = 0,
				y = 0
			}
		} = config;

		// scope binding
		this.render = this.render.bind(this);
		this.update = this.update.bind(this);

		// setup
		this.X = x;
		this.Y = y;
		this.#GAME = game;
		this.#TEAM = team;

		this.#state = new Proxy(
			{ scored: false },
			{ set: set.bind(true, this.update) }
		);

	}// constructor

	render(context){

		const { UNIT, BALL } = this.#GAME;

		const width  = this.WIDTH * UNIT;
		const height = this.HEIGHT * UNIT;
		

		const xStart = (this.X * UNIT) - (width / 2);
		const yStart = (this.Y * UNIT) - (height / 2);

		context.fillStyle = "green";
		context.fillRect(
			xStart, yStart,
			width, height
		);

		// COLLISION DETECTION
		// -------------------------
		const collisionVector = getCollisionVector(this, BALL);
		if(collisionVector) this.#state.scored = true;
	}// render


	update(key, val, prev){
		switch(key){
			case "scored":
				if(val){
					this.#GAME.scoreGoal(this.#TEAM);
					this.#state.scored = false;
				}
				break;
		}
	}// update



}// Goal