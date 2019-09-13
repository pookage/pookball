import React, { useEffect } from "react";

import Canvas from "COMPONENTS/Canvas/";

export default function App(props){

	const { canvas } = props;

	return(
		<Canvas
			element={ canvas }
		/>
	);
} // App