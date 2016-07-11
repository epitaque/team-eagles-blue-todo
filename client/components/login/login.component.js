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
var router_1 = require('@angular/router');
var user_1 = require('../../models/user');
var LoginComponent = (function () {
    function LoginComponent(todoService, router) {
        var _this = this;
        this.todoService = todoService;
        this.router = router;
        this.model = new user_1.User();
        this.todoService.loginStream.subscribe(function (e) {
            if (e == null) {
            }
            else if (e.error) {
                _this.error = e.error;
            }
            else if (e.user) {
                router.navigate(['/todos']);
            }
            else {
                _this.error = "Unknown error logging in.";
            }
        });
        this.submitted = false;
    }
    LoginComponent.prototype.onSubmit = function () {
        this.todoService.login(this.model);
        this.submitted = true;
    };
    Object.defineProperty(LoginComponent.prototype, "diagnostic", {
        get: function () { return JSON.stringify(this.model); },
        enumerable: true,
        configurable: true
    });
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            host: { 'class': 'rcontaine' },
            // we're using a separate html file this time because the form html is long
            templateUrl: 'components/login/login.component.html',
            styleUrls: ['components/login/login.component.css']
        }), 
        __metadata('design:paramtypes', [todo_service_1.TodoService, router_1.Router])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map