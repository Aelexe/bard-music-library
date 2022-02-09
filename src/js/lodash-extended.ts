import _ from "lodash";

declare module "lodash" {
	interface LoDashStatic {
		hasValuesOf<TValue>(object: TValue, comparisonObject: any): TValue;
	}
	interface LoDashExplicitWrapper<TValue> {
		hasValuesOf(): LoDashExplicitWrapper<TValue>;
	}
}

_.mixin({
	hasValuesOf,
});

/**
 * Returns whether the provided object contains all values of the comparison object.
 * @param object Object to check the values of.
 * @param comparisonObject Object with values to check for.
 * @returns Whether the object contains all the values.
 */
function hasValuesOf(object: any, comparisonObject: any): boolean {
	if (object === undefined) {
		if (comparisonObject === undefined) {
			return true;
		} else {
			return false;
		}
	}

	if (comparisonObject === undefined || comparisonObject === null) {
		return true;
	}

	const keys = Object.keys(comparisonObject);

	let hasValues = true;

	keys.every((key) => {
		const type = typeof object[key];

		if (type !== typeof comparisonObject[key]) {
			hasValues = false;
			return false;
		}

		if (type === "object") {
			if (!hasValuesOf(object[key], comparisonObject[key])) {
				hasValues = false;
				return false;
			}
		} else {
			if (object[key] !== comparisonObject[key]) {
				hasValues = false;
				return false;
			}
		}

		return true;
	});

	return hasValues;
}

export default _;
