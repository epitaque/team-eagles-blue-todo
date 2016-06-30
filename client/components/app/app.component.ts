import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'main-app',
    template: `<h1>Blue Eagles Todo</h1>
                <todo-list></todo-list>`
})
export class MainComponent {}