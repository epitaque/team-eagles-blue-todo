export class Todo {
	constructor(
		public todoText: string,
		private __importance: number, // 1:low importance, 2: moderately important, 3: highly important
		public completed: boolean) {
	}

	get importance(): number {
		return this.__importance;
	}

	set importance(theImportance: number) {
		if(theImportance < 1 || theImportance > 3) {
			throw new RangeError("Importance value must be between 1 and 3 (inclusive)");
		}
		else {
			this.__importance = theImportance;
		}
	} 
}