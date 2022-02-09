/**
 * Adds an event listener to the document.
 * @param eventType Event type to listen for.
 * @param listener Callback to execute when the event is received.
 */
function on(eventType: string, listener: (data?: unknown) => void): void {
	document.addEventListener(eventType, listener);
}

/**
 * Removes an event listener from the document.
 * @param eventType Event type to remove.
 * @param listener Callback function to remove the listener for.
 */
function off(eventType: string, listener: (data?: unknown) => void): void {
	document.removeEventListener(eventType, listener);
}

/**
 * Adds an event listener to the document that will remove itself the first time it is triggered.
 * @param eventType Event type to listen for.
 * @param listener Callback to execute when the event is received.
 */
function once(eventType: string, listener: (data?: unknown) => void): void {
	on(eventType, handleEventOnce);

	function handleEventOnce() {
		listener();
		off(eventType, handleEventOnce);
	}
}

/**
 * Triggers an event on the document.
 * @param eventType Event type to trigger.
 */
function trigger(eventType: string): void;
/**
 * Triggers an event on the document.
 * @param eventType Event type to trigger.
 * @param data Data to trigger the event with.
 */
function trigger(eventType: string, data: unknown): void;
function trigger(eventType: string, data?: unknown): void {
	const event = new CustomEvent(eventType, { detail: data });
	document.dispatchEvent(event);
}

export { on, once, off, trigger };
