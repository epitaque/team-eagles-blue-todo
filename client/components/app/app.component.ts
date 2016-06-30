import {Component} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {LoginEvent} from '../../models/LoginEvent';
import {User} from '../../models/User';


@Component({
    selector: 'main-app',
    template: `<h1>Blue Eagles Todo</h1>
                <div *ngIf="user != null"> 
                    {{user.username}}
                    {{user.email}}
                </div>
                <todo-list></todo-list>
                `,
    providers: [TodoService]
})
export class MainComponent {
    public user: User;
    public error: string;
    
    constructor(private todoService: TodoService) {
        todoService.loginStream.subscribe(this.onLogin);
        this.user.
    }

    private onLogin(e: LoginEvent): void {
        if(e.error) {
            this.user = null;
            this.error = e.error;
        }
        else {
            this.error = null;
            this.user = e.user;
        }
    }
}