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
	const drawGuide = guide.bind(true, context);

	// vertical
	drawGuide({
		start: [ xCenter, 0 ], 
		end: [ xCenter, height ], 
		color: "red"
	});
	
	// horizontal
	drawGuide({
		start: [ 0, yCenter ],
		end: [ width, yCenter ],
		color: "blue"
	});


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

function guide(context, { start, end, color }){

	const [ startX, startY ] = start;
	const [ endX, endY ]     = end;

	context.strokeStyle = color;
	context.beginPath();
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.stroke();
}// drawGuide