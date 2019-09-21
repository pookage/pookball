export function debounce(callback, fps = 30, key="DEBOUNCE"){
	const now                 = Date.now();
	const debounceKey         = `${key}__LAST_CALL`;
	const timeSinceLastUpdate = now - (window[debounceKey] || now);

	if(timeSinceLastUpdate > (1000 / fps) || !window[debounceKey]){
		requestAnimationFrame(callback);
		window[debounceKey] = now;
	}
}// debounce

export function scrollCanvas(canvas, event){

	const { clientX, clientY, target } = event;
	const { innerWidth, innerHeight, scrollX, scrollY } = window;
	const { clientHeight, clientWidth } = canvas;
	const hitbox = innerHeight * 0.1;

	const scrollLeft = clientX < hitbox;
	const scrollRight = clientX > (innerWidth - hitbox);
	const scrollUp = clientY < hitbox;
	const scrollDown = clientY > (innerHeight - hitbox);

	const canScrollLeft = scrollX > 0;
	const canScrollRight = (clientWidth - scrollX - innerWidth) > 0;
	const canScrollUp = scrollY > 0;
	const canScrollDown = (clientHeight - scrollY - innerHeight) > 0;
 
	const scrollStep = 10;


	let nextScroll = {
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

	// console.log(nextScroll)

	window.scrollTo(nextScroll.x, nextScroll.y);

}// scrollCanvas