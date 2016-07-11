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
var router_1 = require('@angular/router');
var todo_service_1 = require('../../services/todo.service');
var NavbarComponent = (function () {
    function NavbarComponent(router, todoService, _ngZone) {
        var _this = this;
        this.router = router;
        this.todoService = todoService;
        this._ngZone = _ngZone;
        NavbarComponent.scope = this;
        var scope = NavbarComponent.scope;
        this.todoService.loginStream.subscribe(function (e) {
            if (e == null) {
                _this.user = null;
                _this.error = null;
                _this.loggedIn = false;
                _this.router.navigate(['/login']);
            }
            else if (e.error) {
                scope.user = null;
                scope.error = e.error;
            }
            else {
                scope.error = null;
                scope.user = e.user;
                NavbarComponent.scope.loggedIn = true;
            }
        }, function (err) {
            console.log("Navbar loginStream error", err);
        }, function () {
            console.log("Navbar loginStream completed");
        });
        this.loggedIn = false;
    }
    NavbarComponent.prototype.logout = function () {
        if (this.user != null) {
            this.todoService.logout();
        }
        else {
            this.error = "Can't log out when not logged in.";
            this.router.navigate(['/login']);
        }
    };
    NavbarComponent = __decorate([
        core_1.Component({
            selector: 'eagles-navbar',
            directives: [router_1.ROUTER_DIRECTIVES],
            templateUrl: 'components/navbar/navbar.component.html',
        }), 
        __metadata('design:paramtypes', [router_1.Router, todo_service_1.TodoService, core_1.NgZone])
    ], NavbarComponent);
    return NavbarComponent;
}());
exports.NavbarComponent = NavbarComponent;
//# sourceMappingURL=navbar.component.js.map