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
var EditUserComponent = (function () {
    function EditUserComponent(todoService, router) {
        var _this = this;
        this.todoService = todoService;
        this.router = router;
        if (!this.todoService.loggedIn == true) {
            this.router.navigate(['/login']);
            return;
        }
        else {
            this.model = todoService.user;
            this.submitted = false;
            this.todoService.loginStream.subscribe(function (e) {
                if (e == null || e.error || !e.user) {
                    _this.router.navigate(['/login']);
                }
            }).unsubscribe();
        }
    }
    EditUserComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        console.log("Asking service to edit profile");
        this.todoService.editProfile(this.model).subscribe(function (e) {
            if (e.error) {
                _this.error = e.error;
            }
            else {
                _this.todoService.checkUser();
                _this.router.navigate(['/']);
            }
        }, function (error) {
            _this.error = error;
        });
    };
    EditUserComponent = __decorate([
        core_1.Component({
            selector: 'edituser',
            host: { 'class': 'rcontaine' },
            templateUrl: 'components/edituser/edituser.component.html',
            styleUrls: ['styles/forms.css']
        }), 
        __metadata('design:paramtypes', [todo_service_1.TodoService, router_1.Router])
    ], EditUserComponent);
    return EditUserComponent;
}());
exports.EditUserComponent = EditUserComponent;
//# sourceMappingURL=edituser.component.js.map