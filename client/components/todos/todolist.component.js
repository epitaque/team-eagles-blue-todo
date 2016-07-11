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
var todo_service_1 = require('../../services/todo.service');
var todo_component_1 = require('./todo.component');
var router_1 = require('@angular/router');
var TodoListComponent = (function () {
    function TodoListComponent(todoService, router) {
        this.todoService = todoService;
        this.router = router;
    }
    TodoListComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.todoService.loggedIn == true) {
            this.router.navigate(['/login']);
            return;
        }
        this.todoService.logoutStream.subscribe(function (e) {
            if (e) {
                _this.router.navigate(['/login']);
                return;
            }
        });
        this.todoService.getTodos();
        this.todoService.todoStream.subscribe(function (todos) {
            console.log("TodoService pushed todos");
            _this.todos = todos;
        }, function (error) {
            console.log("TodoService pushed error");
            _this.error = error;
        }, function () {
            console.log("TodoService todo completed");
        });
    };
    TodoListComponent.prototype.todoUpdated = function (ev) {
        if (ev.deleted) {
            this.todoService.deleteTodo(ev.todo);
        }
        else {
            console.log("editing todo 2");
            this.todoService.editTodo(ev.todo);
        }
    };
    TodoListComponent.prototype.addTodo = function (todo) {
        console.log("Adding todo", todo);
        this.todoService.postTodo(todo);
    };
    TodoListComponent = __decorate([
        core_1.Component({
            selector: 'todo-list',
            directives: [todo_component_1.TodoComponent],
            styleUrls: ['components/todos/todolist.component.css'],
            templateUrl: 'components/todos/todolist.component.html'
        }), 
        __metadata('design:paramtypes', [todo_service_1.TodoService, router_1.Router])
    ], TodoListComponent);
    return TodoListComponent;
}());
exports.TodoListComponent = TodoListComponent;
//# sourceMappingURL=todolist.component.js.map