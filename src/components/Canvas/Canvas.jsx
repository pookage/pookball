import React, { useEffect, useState } from "react";
import { debounce } from "SHARED/utils.js";

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
	useEffect(syncGameDimensions, [ size ]);


	// EFFECTS
	// ------------------------
	function init(){
		updateSize();
	}// init
	function updateListeners(){
		window.addEventListener("resize", updateSize);
		element.addEventListener("mousemove", updateCursorPosition);
		return () => { 
			window.removeEventListener("resize", updateSize);
			element.removeEventListener("mousemove", updateCursorPosition);
		}
	}// updateListeners
	function syncGameDimensions(){
		game.updateSize(size);
	}// syncGameDimensions


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
	function updateCursorPosition(event){
		debounce(updateGameCursor.bind(true, event), 10);
	}// updateCursorPosition
	function updateGameCursor(event){
		const { clientX, clientY } = event;
		game.updateCursorPosition({ x: clientX, y: clientY });
	}// updateGameCursor

	return null;
} // Canvas