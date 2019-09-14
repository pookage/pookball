import React, { useEffect } from "react";

import Canvas from "COMPONENTS/Canvas/";
import Game from "ENTITIES/Game/";

export default function App(props){

	// PROPS
	// ----------------
	const { canvas } = props;
	const config     = {
		canvas
	};
	const game = new Game(config);

	return(
		<Canvas
			element={ canvas }
			game={ game }
		/>
	);
} // App