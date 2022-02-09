/**
 * Executes a callback function once the document is loaded, or immediately if the document is already loaded.
 * @param callback The callback to execute.
 */
export default function onDocumentReady(callback: () => void): void {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(callback, 1);
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
}
