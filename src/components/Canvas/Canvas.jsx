import React, { useEffect, useState } from "react";
import { UTILS } from "./";

export default function Canvas(props){

	// PROPS
	// ------------------------
	const { 
		element,
		game
	} = props;

	// HOOKS

	// ------------------------
	const [ size, setSize ] = useState({ 
		width:  window.innerWidth, 
		height: window.innerHeight
	});
	useEffect(init, []);
	useEffect(updateListeners);
	useEffect(syncCanvasDimensions, [ size ]);


	// EFFECTS
	// ------------------------
	function init(){
		updateSize();
	}// init
	function updateListeners(){
		window.addEventListener("resize", updateSize);
		return () => { window.removeEventListener("resize", updateSize); }
	}// updateListeners
	function syncCanvasDimensions(){
		game.updateSize(size);
	}// syncCanvasDimensions


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

	return null;
} // Canvas