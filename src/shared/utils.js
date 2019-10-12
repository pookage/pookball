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
 
	// console.log({ scrollUp, y, hitbox });


	const scrollStep = speed * deltaTime;

	const nextScroll = {
		y: scrollY,
		x: scrollX
	}
	if(scrollLeft && canScrollLeft){
		nextScroll.x -= scrollStep;
	} else if (scrollRight && canScrollRight) {
		nextScroll.x += scrollStep;
	}

	if(scrollUp && canScrollUp){
		nextScroll.y -= scrollStep;
	} else if (scrollDown && canScrollDown) {
		nextScroll.y += scrollStep;
	}

	return nextScroll;
}// scrollCanvas