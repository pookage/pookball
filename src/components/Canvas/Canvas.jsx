import React, { useEffect, useState } from "react";
import { UTILS } from "./";

export default function Canvas(props){

	// PROPS
	// ------------------------
	const { element } = props;

	// HOOKS
	// ------------------------
	const [ size, setSize ] = useState({ 
		width:  window.innerWidth, 
		height: window.innerHeight
	});
	useEffect(init, []);
	useEffect(updateListeners);


	// EFFECTS
	// ------------------------
	function init(){
		updateSize();
	}// init
	function updateListeners(){
		window.addEventListener("resize", updateSize);
		return () => { window.removeEventListener("resize", updateSize); }
	}// updateListeners


	// EVENT LISTENERS
	// ----------------------
	function updateSize(){
		const { 
			innerWidth: width, 
			innerHeight: height 
		} = window;
		
		element.width  = width;
		element.height = height;

		setSize({ width, height });
	}// updateSize


	// RENDER
	// ----------------------
	const context = element.getContext("2d");
	UTILS.draw(context, size);

	return null;
} // Canvas