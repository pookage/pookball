export default class Entity {
	#x;
	#y;
	#CHILDREN;

	constructor(config){

		const {
			position: { x, y }
		} = config;

		// scope binding
		this.render = this.render.bind(this);
		this.initChildren = this.initChildren.bind(this);

		// init private vars
		this.#x = x;
		this.#y = y;
		this.#CHILDREN = this.initChildren();
	}// constructor

	initChildren(){
		return [];
	}// initChildren;

	render(context){
		for(let child of this.#CHILDREN){
			child.render(context);
		}
	}// context

	


}// Entity