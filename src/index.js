import React from "react";
import ReactDOM from "react-dom";

import App from "COMPONENTS/App/";
import "SHARED/reset.scss";
import "SHARED/global.scss";

window.addEventListener("DOMContentLoaded", init);

function init(){

	const canvas = document.getElementById("canvas");

	ReactDOM.render(
		<App canvas={ canvas }/>,
		document.getElementById("app")
	);
}
