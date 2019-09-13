// config
const playerScale = 0.05;

export function draw(canvas){

	const context = canvas.getContext("2d");
	
	// dimensions
	// ------------------------------
	const { width, height } = canvas;
	const playerSize        = height * playerScale;


	//scope binding
	// ------------------------------
	const drawPlayer = player.bind(true, context, playerSize);
	const drawGoal   = goal.bind(true, context, playerSize);
	const drawGuide  = guide.bind(true, context);


	// positioning
	// ------------------------------
	const xCenter = width / 2;
	const yCenter = height / 2;


	// draw guides
	// -------------------------------
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


	// draw goal
	// ---------------------------
	drawGoal({ x: xCenter, y: 0 });


	// draw players
	// ----------------------------
	// striker
	drawPlayer({ x: xCenter, y: yCenter });
	// goalie
	drawPlayer({ x: xCenter, y: playerSize * 1.1 });	

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

function goal(context, playerSize, { x, y }){

	const goalWidth  = playerSize * 10;
	const goalRadius = goalWidth / 2;
	const goalHeight = goalWidth * 0.05;
	const xGoalStart = x - goalRadius;
	const xGoalEnd   = x + goalRadius;
	const yGoalStart = y
	const yGoalEnd   = goalHeight;
	const goalieOffset = goalHeight + (playerSize * 0.1) + (playerSize / 2);

	// context.beginPath();
	context.fillStyle = "green";
	context.fillRect(
		xGoalStart, yGoalStart, 
		goalWidth, goalHeight
	);
}// goal