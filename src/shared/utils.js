export const debounce = (callback, fps = 30, key="DEBOUNCE") => {
	const now                 = Date.now();
	const debounceKey         = `${key}__LAST_CALL`;
	const timeSinceLastUpdate = now - (window[debounceKey] || now);

	if(timeSinceLastUpdate > (1000 / fps) || !window[debounceKey]){
		requestAnimationFrame(callback);
		window[debounceKey] = now;
	}
} // debounce