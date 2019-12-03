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
	if(target === 0){
		return current - (decelleration * 2)
	} else if(current > target){
		return current - decelleration;
	} else if (current < target) {
		return current + accelleration;
	} else return target;
} // easeInOut

export function getCollisionVector(a, b, GAME){

	const { 
		X: aPosX,
		Y: aPosY,
		HEIGHT: aHeightAbs,
		WIDTH: aWidthAbs,
		RADIUS: aRadius,
	} = a;

	const {
		X: bPosX,
		Y: bPosY,
		HEIGHT: bHeightAbs,
		WIDTH: bWidthAbs,
		RADIUS: bRadius
	} = b;

	const aHeight = aHeightAbs || aRadius;
	const aWidth  = aWidthAbs || aRadius;

	const bHeight = bHeightAbs || bRadius;
	const bWidth  = bWidthAbs || bRadius;

	const horizontalIntersection = aPosX < (bPosX + bWidth) && bPosX < (aPosX + aWidth);
	const verticalIntersection   = aPosY < (bPosY + bHeight) && bPosY < (aPosY + aHeight);

	// console.log({ horizontalIntersection, verticalIntersection })

	if(horizontalIntersection && verticalIntersection) return true;
	else                                               return false;
}// getCollisionVector