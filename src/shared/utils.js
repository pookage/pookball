export function debounce(callback, fps = 30, key="DEBOUNCE"){
	const now                 = Date.now();
	const debounceKey         = `${key}__LAST_CALL`;
	const timeSinceLastUpdate = now - (window[debounceKey] || now);

	if(timeSinceLastUpdate > (1000 / fps) || !window[debounceKey]){
		requestAnimationFrame(callback);
		window[debounceKey] = now;
	}
}// debounce

export function calculateScroll({ x, y }, canvas, speed, deltaTime){

	const { innerWidth, innerHeight, scrollX, scrollY } = window;
	const { clientHeight, clientWidth } = canvas;
	const hitbox = innerHeight * 0.20;

	const scrollLeft = x < hitbox;
	const scrollRight = x > (innerWidth - hitbox);
	const scrollUp = y < hitbox;
	const scrollDown = y > (innerHeight - hitbox);

	const canScrollLeft = scrollX > 0;
	const canScrollRight = (clientWidth - scrollX - innerWidth) > 0;
	const canScrollUp = scrollY > 0;
	const canScrollDown = (clientHeight - scrollY - innerHeight) > 0;

	const scrollStep = speed * deltaTime;

	const nextScroll = {
		y: scrollY,
		x: scrollX,
		stepX: 0,
		stepY: 0
	};

	if(scrollLeft && canScrollLeft){
		nextScroll.x -= scrollStep;     // x offset to scroll to
		nextScroll.stepX = -scrollStep; // amount that has been scrolled
	} else if (scrollRight && canScrollRight) {
		nextScroll.x += scrollStep;
		nextScroll.stepX = scrollStep;
	}

	if(scrollUp && canScrollUp){
		nextScroll.y -= scrollStep;
		nextScroll.stepY = -scrollStep;
	} else if (scrollDown && canScrollDown) {
		nextScroll.y += scrollStep;
		nextScroll.stepY = scrollStep;
	}

	return nextScroll;
}// scrollCanvas

export function easeInOut(current, target, accelleration, decelleration){

	//NOTE : by doing decelleration-first we get that neat little bouncing thing
	if(target === 0 && current > 0){
		return current - (decelleration * 2)
	} else if(current > target){
		return current - decelleration;
	} else if (current < target) {
		return current + accelleration;
	} else return target;
} // easeInOut

export function getCollisionVector(source, target, GAME){

	const { 
		X: sourcePosX,
		Y: sourcePosY,
		HEIGHT: sourceHeightAbs,
		WIDTH: sourceWidthAbs,
		RADIUS: sourceRadius,
		direction
	} = source;

	const {
		X: targetPosX,
		Y: targetPosY,
		HEIGHT: targetHeightAbs,
		WIDTH: targetWidthAbs,
		RADIUS: targetRadius
	} = target;

	const sourceHeight = sourceHeightAbs || sourceRadius;
	const sourceWidth  = sourceWidthAbs  || sourceRadius;

	const targetHeight = targetHeightAbs || targetRadius;
	const targetWidth  = targetWidthAbs  || targetRadius;

	const horizontalIntersection = 
		sourcePosX < (targetPosX + targetWidth) && 
		targetPosX < (sourcePosX + sourceWidth);

	const verticalIntersection = 
		sourcePosY < (targetPosY + targetHeight) &&
		targetPosY < (sourcePosY + sourceHeight);

	const collision = horizontalIntersection && verticalIntersection;

	if(collision) return direction;
}// getCollisionVector