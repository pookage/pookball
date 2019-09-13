// config
const playerScale = 0.05;

export function draw(canvas){

	const context = canvas.getContext("2d");
	
	// dimensions
	const { width, height } = canvas;
	const playerSize        = height * playerScale;
	const drawPlayer        = player.bind(true, context, playerSize);

	// positioning
	const xCenter       = width / 2;
	const yCenter       = height / 2;

	// draw guides
	// -------------------------------
	// vertical
	context.strokeStyle = "red";
	context.beginPath();
	context.moveTo(xCenter, 0);
	context.lineTo(xCenter, height);
	context.stroke();
	// horizontal
	context.strokeStyle = "blue";
	context.beginPath();
	context.moveTo(0, yCenter);
	context.lineTo(width, yCenter);
	context.stroke();


	// draw players
	// ----------------------------
	// striker
	drawPlayer({ x: xCenter, y: yCenter });



	// draw goal
	// ---------------------------
	const goalWidth  = playerSize * 10;
	const goalRadius = goalWidth / 2;
	const goalHeight = goalWidth * 0.05;
	const xGoalStart = xCenter - goalRadius;
	const xGoalEnd   = xCenter + goalRadius;
	const yGoalStart = 0
	const yGoalEnd   = goalHeight;
	const goalieOffset = goalHeight + (playerSize * 0.1) + (playerSize / 2);

	// context.beginPath();
	context.fillStyle = "green";
	context.fillRect(
		xGoalStart, yGoalStart, 
		goalWidth, goalHeight
	);

	drawPlayer({ x: xCenter, y: goalieOffset });

}// draw

function player(context, size, { x, y }){

	context.beginPath();
	context.fillStyle = "black";
	context.moveTo(x, y)
	context.arc(
		x, 
		y, 
		size / 2,
		0,
		Math.PI * 2
	);
	context.fill();
} // player

