export default class Entity {
	x;
	y;
	CHILDREN;

	constructor(config){

		const {
			position: { x = 0, y = 0 }
		} = config;

		this.x = x;
		this.y = y;

		// scope binding
		this.render = this.render.bind(this);
	}// constructor

	render(context){
		for(let child of this.CHILDREN){
			child.render(context);
		}
	}// context




}// Entity