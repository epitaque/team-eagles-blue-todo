"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var TodoEdit_1 = require('../../models/TodoEdit');
var TodoComponent = (function () {
    function TodoComponent() {
        this.todoUpdated = new core_1.EventEmitter();
    }
    TodoComponent.prototype.editTodo = function (importance) {
        var _this = this;
        if (importance) {
            this.todo.importance = importance;
        }
        ;
        console.log("editing todo", JSON.stringify(importance));
        setTimeout(function () {
            _this.todoUpdated.emit(new TodoEdit_1.TodoEdit(false, _this.todo));
            return null;
        }, 100);
    };
    TodoComponent.prototype.enterEditMode = function () {
        this.editMode = true;
    };
    TodoComponent.prototype.leaveEditMode = function () {
        this.editMode = false;
    };
    TodoComponent.prototype.removeTodo = function () {
        this.todoUpdated.emit(new TodoEdit_1.TodoEdit(true, this.todo));
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TodoComponent.prototype, "todoUpdated", void 0);
    TodoComponent = __decorate([
        core_1.Component({
            host: {
                'style': 'width: 100%'
            },
            selector: 'todo',
            inputs: ['todo'],
            templateUrl: 'components/todos/todo.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], TodoComponent);
    return TodoComponent;
}());
exports.TodoComponent = TodoComponent;
//# sourceMappingURL=todo.component.js.map