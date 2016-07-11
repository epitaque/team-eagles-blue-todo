"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_component_1 = require('./app/app.component');
var app_routes_1 = require('./routes/app.routes');
var http_1 = require('@angular/http');
var todo_service_1 = require('../services/todo.service');
var forms_1 = require('@angular/forms');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    app_routes_1.APP_ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    todo_service_1.TodoService,
    forms_1.disableDeprecatedForms(),
    forms_1.provideForms()
]).catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map