export default class Guide {
	#TYPE   = "VERTICAL";
	#COLOR  = "RED";
	#X      = 0;
	#Y      = 0;
	#LENGTH;

	constructor(config){
		const { 
			type   = this.#TYPE,
			color  = this.#COLOR,
			length,
			position: { 
				x = this.#X,
				y = this.#Y
			}
		} = config

		this.#TYPE   = type;
		this.#X      = x;
		this.#Y      = y;
		this.#COLOR  = color;
		this.#LENGTH = length;

		// scope binding
		this.render = this.render.bind(this);
		this.scale  = this.scale.bind(this);
	}// constructor

	/* SCALE
	--------------------------------
		how to behave when the canvas is resized
	*/
	scale(prev, next){
		
		let axis;
		switch(this.#TYPE){
			case "VERTICAL":
				axis = 'height';
				break;

			case "HORIZONTAL":
				axis = 'width';
				break;
		}

		const scalars = {
			x: this.#X / prev.width,
			y: this.#Y / prev.height,
			length: this.#LENGTH / prev[axis]
		};

		this.#X      = scalars.x * next.width;
		this.#Y      = scalars.y * next.height;
		this.#LENGTH = scalars.length * next[axis];
	}// scale


	/* RENDER
	---------------------------------
		what to output to the canvas
	*/
	render(context){
		const startX = this.#X;
		const startY = this.#Y;

		let endX, endY;
		switch(this.#TYPE){

			case "VERTICAL":
				endX = startX;
				endY = this.#LENGTH;
				break;

			case "HORIZONTAL":
				endX = this.#LENGTH;
				endY = startY;
				break;
		}

		context.strokeStyle = this.#COLOR;
		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(endX, endY);
		context.stroke();
	}// render
};