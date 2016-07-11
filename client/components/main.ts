import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './app/app.component';
import {APP_ROUTER_PROVIDERS} from './routes/app.routes';
import {HTTP_PROVIDERS} from '@angular/http';
import {TodoService} from '../services/todo.service';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import {enableProdMode} from "@angular/core";
enableProdMode();
bootstrap(AppComponent, [
	APP_ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	TodoService,
	disableDeprecatedForms(),
	provideForms()
]).catch(err => console.log(err));