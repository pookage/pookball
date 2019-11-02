import React from "react";
import ReactDOM from "react-dom";

import App from "COMPONENTS/App/";
import Game from "ENTITIES/Game/";

import "SHARED/reset.scss";
import "SHARED/global.scss";

window.addEventListener("DOMContentLoaded", init);

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

function init(){

	const config = {
		window
	};

	const game   = new Game(config);
	const canvas = game.getCanvas();

	ReactDOM.render(
		<App />,
		document.getElementById("app")
	);

	document.body.appendChild(canvas);
} // init
