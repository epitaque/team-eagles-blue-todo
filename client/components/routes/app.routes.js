"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('../login/login.component');
var register_component_1 = require('../register/register.component');
var todolist_component_1 = require('../todos/todolist.component');
var edituser_component_1 = require('../edituser/edituser.component');
exports.routes = [
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'register', component: register_component_1.RegisterComponent },
    { path: 'todos', component: todolist_component_1.TodoListComponent },
    { path: 'editprofile', component: edituser_component_1.EditUserComponent },
    { path: '**', component: login_component_1.LoginComponent }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(exports.routes)
];
//# sourceMappingURL=app.routes.js.map