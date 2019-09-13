export function draw(canvas){

	const context = canvas.getContext("2d");
	
	// dimensions
	const { width, height } = canvas;
	const playerSize        = height * 0.05;

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


	// draw player
	// ----------------------------
	const playerX = xCenter;
	const playerY = yCenter;

	context.beginPath();
	context.strokeStyle = "black";
	context.moveTo(xCenter, yCenter)
	context.arc(
		playerX, 
		playerY, 
		playerSize / 2,
		0,
		Math.PI * 2
	);
	context.fill();


	// draw goal
	// ---------------------------
	const goalWidth  = playerSize * 4.2;
	const goalRadius = goalWidth / 2;
	const goalHeight = goalWidth * 0.1;
	const xGoalStart = xCenter - goalRadius;
	const xGoalEnd   = xCenter + goalRadius;
	const yGoalStart = 0
	const yGoalEnd   = goalHeight;

	// context.beginPath();
	context.fillStyle = "green";
	context.fillRect(
		xGoalStart, yGoalStart, 
		goalWidth, goalHeight
	);

}// draw