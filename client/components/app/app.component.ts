import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {LoginEvent} from '../../models/LoginEvent';
import {User} from '../../models/User';

@Component({
    selector: 'main-app',
    providers: [TodoService],
    directives: [ROUTER_DIRECTIVES],
    template: `<h1>Blue Eagles Todo</h1>
                <nav *ngIf="user == null" >
                    <a [routerLink]="['/login']">Login</a>
                    <a [routerLink]="['/register']">Register</a>
                </nav>
                <router-outlet></router-outlet>

                <div *ngIf="user != null"> 
                    {{user.username}}
                    {{user.email}}
                    <button onclick="logout()">Logout</button>
                </div>
                <todo-list></todo-list>
                `
})
export class AppComponent {
    public user: User;
    public error: string;
    
    constructor(private todoService: TodoService) {
        todoService.loginStream.subscribe(this.onLogin);
    }

    private onLogin(e: LoginEvent): void {
        if(e == null) return;
        if(e.error) {
            this.user = null;
            this.error = e.error;
        }
        else {
            this.error = null;
            this.user = e.user;
        }
    }

    private logout(): void {
        if(this.user != null) {
            this.todoService.logout();
            this.user = null;
            this.error = null;
        } 
        else {
            throw new Error("Can't log out when not logged in.");
        }
    }
}