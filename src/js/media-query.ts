const minMax = 575;
const phoneMin = 576;
const phoneMax = 767;
const tabletMin = 768;
const tabletMax = 991;
const desktopSmallMin = 992;
const desktopSmallMax = 1199;
const desktopMin = 1200;
const desktopMax = 1349;
const maxMin = 1350;

const min = "min";
const phone = "phone";
const tablet = "tablet";
const desktopSmall = "desktopSmall";
const desktop = "desktop";
const max = "max";

export { min, phone, tablet, desktopSmall, desktop, max };

/**
 * Checks whether the viewport is within the dimensions of the provided screen size.
 *
 * @param size The screen size to check for.
 * @returns Whether the viewport dimensions match the screen size.
 */
function is(
	size: typeof min | typeof phone | typeof tablet | typeof desktopSmall | typeof desktop | typeof max
): boolean {
	const viewWidth = $(window).width() || 0;

	if (size === min) {
		return viewWidth <= minMax;
	} else if (size === phone) {
		return viewWidth >= phoneMin && viewWidth <= phoneMax;
	} else if (size === tablet) {
		return viewWidth >= tabletMin && viewWidth <= tabletMax;
	} else if (size === desktopSmall) {
		return viewWidth >= desktopSmallMin && viewWidth <= desktopSmallMax;
	} else if (size === desktop) {
		return viewWidth >= desktopMin && viewWidth <= desktopMax;
	} else if (size === max) {
		return viewWidth >= maxMin;
	}

	return false;
}

/**
 * Checks whether the viewport is at least as big as the provided screen size.
 *
 * @param size The screen size to check for.
 * @returns Whether the viewport is at least as big as the screen size.
 */
function isAtLeast(
	size: typeof min | typeof phone | typeof tablet | typeof desktopSmall | typeof desktop | typeof max
): boolean {
	const viewWidth = $(window).width() || 0;

	if (size === min) {
		return true;
	} else if (size === phone) {
		return viewWidth >= phoneMin;
	} else if (size === tablet) {
		return viewWidth >= tabletMin;
	} else if (size === desktopSmall) {
		return viewWidth >= desktopSmallMin;
	} else if (size === desktop) {
		return viewWidth >= desktopMin;
	} else if (size === max) {
		return viewWidth >= maxMin;
	}

	return false;
}

/**
 * Checks whether the viewport is not bigger than the provided screen size.
 *
 * @param size The screen size to check for.
 * @returns Whether the viewport is not bigger than the provided screen size.
 */
function isAtMost(
	size: typeof min | typeof phone | typeof tablet | typeof desktopSmall | typeof desktop | typeof max
): boolean {
	const viewWidth = $(window).width() || 0;

	if (size === min) {
		return false;
	} else if (size === phone) {
		return viewWidth <= phoneMax;
	} else if (size === tablet) {
		return viewWidth <= tabletMax;
	} else if (size === desktopSmall) {
		return viewWidth <= desktopSmallMax;
	} else if (size === desktop) {
		return viewWidth <= desktopMax;
	} else if (size === max) {
		return true;
	}

	return false;
}

export { is, isAtLeast, isAtMost };
