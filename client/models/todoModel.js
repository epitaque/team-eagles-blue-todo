"use strict";
var Todo = (function () {
    function Todo(task, __importance, // 1:low importance, 2: moderately important, 3: highly important
        completed) {
        this.task = task;
        this.__importance = __importance;
        this.completed = completed;
    }
    Object.defineProperty(Todo.prototype, "importance", {
        get: function () {
            return this.__importance;
        },
        set: function (theImportance) {
            if (theImportance < 1 || theImportance > 3) {
                throw new RangeError("Importance value must be between 1 and 3 (inclusive)");
            }
            else {
                this.__importance = theImportance;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Todo;
}());
exports.Todo = Todo;
//# sourceMappingURL=todoModel.js.map