class InputHelper {
	constructor() {}

	static filterObjFalsyField(obj) {
		for (let key in obj) {
			if (!obj[key]) {
				delete obj[key];
			}
		}
		return obj;
	}

	static filterObjNullAndUndefinedField(obj) {
		Object.keys(obj).forEach(
			(val, index) => obj[index] == null && delete obj[index]
		);
		return obj;
	}
}

module.exports = InputHelper;
