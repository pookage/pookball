import React from "react";
import ReactDOM from "react-dom";

import App from "COMPONENTS/App/";
import Game from "ENTITIES/Game/";
import { scrollCanvas } from "SHARED/utils.js"; 

import "SHARED/reset.scss";
import "SHARED/global.scss";

window.addEventListener("DOMContentLoaded", init);

function init(){

	const config = {
		window
	};

	const game   = new Game(config);
	const canvas = game.getCanvas();

	const scroll = scrollCanvas.bind(window, canvas);
	canvas.addEventListener("mousemove", scroll);

	ReactDOM.render(
		<App />,
		document.getElementById("app")
	);

	document.body.appendChild(canvas);
} // init
