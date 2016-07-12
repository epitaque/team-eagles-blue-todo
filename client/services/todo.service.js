// Handles all the HTTP requests of the todo application
// Includes logging in, logging out, registering, sending todos, and receiving todos
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var loginEvent_1 = require('../models/loginEvent');
var user_1 = require('../models/user');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
var Subject_1 = require('rxjs/Subject');
require('../components/app/rxjs-operators');
var TodoService = (function () {
    function TodoService(http) {
        var _this = this;
        this.http = http;
        console.log("TodoService", Math.random(), " instantiated.");
        var baseUrl = window.location.origin;
        this.editUserUrl = baseUrl + 'self';
        this.registerUrl = baseUrl + 'signup';
        this.editTodosUrl = baseUrl + 'self';
        this.loginUrl = baseUrl + 'login';
        this.logoutUrl = baseUrl + 'logout';
        this.getTodosUrl = baseUrl + 'todo';
        this.editTodosUrl = baseUrl + 'todo';
        this.postTodosUrl = baseUrl + 'todo';
        this.checkUserUrl = baseUrl + 'self';
        this.deleteTodosUrl = baseUrl + 'deletetodo';
        this.editUserStream = new Subject_1.Subject();
        this.logoutStream = new Subject_1.Subject();
        this.loginStream = new BehaviorSubject_1.BehaviorSubject(null);
        this.loginStream.subscribe(function (e) {
            console.log("LoginStream pushed: ", e);
            if (e && e.user) {
                _this.user = e.user;
            }
        });
        this.todoStream = new BehaviorSubject_1.BehaviorSubject([]);
        this.todoStream.subscribe(function (e) {
            console.log("todoStream pushed: ", e);
        });
        this.checkUser();
    }
    TodoService.prototype.checkUser = function () {
        var _this = this;
        console.log("checking if user exists...");
        this.http.get(this.checkUserUrl)
            .map(function (res) {
            return res.json();
        })
            .subscribe(function (body) {
            console.log("checkUser res: ", body);
            if (body.message) {
                console.log("it doesn't. error: ", body.message);
                _this.loggedIn = false;
                _this.logoutStream.next(true);
                _this.user = null;
            }
            else if (body.username && body.email) {
                console.log("it does!: ", body.username, body.email);
                _this.user = new user_1.User;
                _this.user.email = body.email;
                console.log("Setting user email to ", body.email);
                _this.user.username = body.username;
                var e = new loginEvent_1.LoginEvent();
                e.user = _this.user;
                console.log("Pushing this event to loginStream: ", e);
                _this.loginStream.next(e);
                _this.loggedIn = true;
            }
            return;
        });
        return this.loginStream;
    };
    TodoService.prototype.login = function (user) {
        var _this = this;
        console.log("Trying to login...");
        var body = JSON.stringify({
            loginUser: {
                username: user.username,
                password: user.password
            }
        });
        console.log("Logging in with body: ", body);
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post(this.loginUrl, body, options)
            .map(function (res) {
            var body = res.json();
            var login = new loginEvent_1.LoginEvent();
            console.log(JSON.stringify(body));
            // if the response body is empty, set login.error
            if (Object.keys(body).length === 0 && body.constructor === Object) {
                login.error = "Empty response from server.";
            } // or if the server sent an error, set login.error to that
            else if (body.error) {
                login.error = body.error;
            } // no error? alright, set the user
            else if (body.username) {
                login.user = new user_1.User();
                login.user.username = body.username;
                login.user.email = body.email;
                _this.loggedIn = true;
                _this.user = user;
            } // no .user or .error but its not empty
            else {
                login.error = "Unrecognized response from server: " + body;
            }
            return login;
        })
            .subscribe(function (e) {
            _this.loginStream.next(e);
        });
        return this.loginStream;
    };
    TodoService.prototype.logout = function () {
        var _this = this;
        console.log("Logging out...");
        this.http.get(this.logoutUrl)
            .map(this.extractData)
            .subscribe(function (body) {
            if (!body.error) {
                console.log("Received logout response");
                _this.loggedIn = false;
                _this.user = null;
                _this.loginStream.next(null);
                _this.logoutStream.next(true);
            }
            else {
                _this.logoutStream.next(false);
            }
        });
        return this.logoutStream;
    };
    TodoService.prototype.register = function (user) {
        console.log("Trying to register...");
        var body = JSON.stringify({
            newUser: {
                email: user.email,
                username: user.username,
                password: user.password
            }
        });
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.registerUrl, body, options)
            .map(this.extractData);
    };
    TodoService.prototype.getTodos = function () {
        var _this = this;
        console.log("Getting todos");
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.get(this.getTodosUrl, options)
            .map(function (res) {
            console.log("Response: ", res);
            console.log("Response as json: ", res.json());
            return res.json();
        })
            .subscribe(function (data) {
            if (data.message) {
                //this.todoStream.error(data.message);
                return;
            }
            else if (data.error) {
                //this.todoStream.error(data.error);
                return;
            }
            _this.todos = data;
            _this.todoStream.next(data);
        });
        return this.todoStream;
    };
    TodoService.prototype.postTodo = function (todo) {
        var _this = this;
        var body = JSON.stringify({
            newTodo: todo
        });
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post(this.postTodosUrl, body, options)
            .map(function (res) {
            return _this.extractData(res);
        })
            .subscribe(function (res) {
            _this.getTodos();
        });
        return this.todoStream;
    };
    TodoService.prototype.deleteTodo = function (todo) {
        var _this = this;
        var body = JSON.stringify({
            todo: todo
        });
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post(this.deleteTodosUrl, body, options).subscribe(function (res) {
            _this.getTodos();
        });
        return this.todoStream;
    };
    TodoService.prototype.editProfile = function (user) {
        var _this = this;
        console.log("Editing profile...");
        var body = JSON.stringify({
            user: {
                email: user.email,
                username: user.username,
                password: user.password
            }
        });
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.post(this.editUserUrl, body, options)
            .map(this.extractData)
            .subscribe(function (body) {
            _this.editUserStream.next(body);
        });
        return this.editUserStream;
    };
    TodoService.prototype.editTodo = function (todo) {
        var _this = this;
        console.log("service editing todo with body", todo);
        var body = JSON.stringify({
            todo: todo
        });
        var headers = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        var options = new http_1.RequestOptions({ headers: headers });
        this.http.put(this.editTodosUrl, body, options).subscribe(function (res) {
            console.log("put request response received", res);
            _this.getTodos();
        });
    };
    TodoService.prototype.extractData = function (res) {
        console.log("extracting data: ", res);
        var body = res.json();
        return body.data || {};
    };
    TodoService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_1.Http)), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TodoService);
    return TodoService;
}());
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map