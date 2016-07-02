import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {LoginEvent} from '../../models/LoginEvent';
import {User} from '../../models/User';
import {NgIf} from '@angular/common';

@Component({
    selector: 'main-app',
    providers: [TodoService],
    directives: [ROUTER_DIRECTIVES, NgIf],
    template: `<h1>Blue Eagles Todo</h1>
                <nav *ngIf="!loggedIn" >
                    <a [routerLink]="['/login']">Login</a>
                    <a [routerLink]="['/register']">Register</a>
                </nav>
                <router-outlet></router-outlet>

                <div *ngIf="loggedIn"> 
                    {{user.username}}
                    {{user.email}}
                    <button onclick="logout()">Logout</button>
                </div>

                <button (click)="toggleLoggedIn()">Toggle loggedIn</button>
                `
})
export class AppComponent {
    public user: User;
    public error: string;
    public loggedIn: boolean;

    constructor(private todoService: TodoService, private zone: NgZone) {
        todoService.loginStream.subscribe(this.onLogin);
        this.loggedIn = false;
        console.log("IsLoggedIn is now: ", this.loggedIn);
    }

    private toggleLoggedIn() {
        console.log("User now: ", this.user);
        console.log("IsLoggedIn before: ", this.loggedIn);
        this.loggedIn = !this.loggedIn;
        console.log("IsLoggedIn is now: ", this.loggedIn);
    }

    private onLogin(e: LoginEvent) {
        console.log("loginStream pushed", e);
        if(e == null) return;
        if(e.error) {
            this.user = null;
            this.error = e.error;
        }
        else {
            this.error = null;
            this.user = e.user;
        }
        this.loggedIn = true;
        console.log("IsLoggedIn is now: ", this.loggedIn);
        console.log('this.user is now: ', this.user);
    }

    private logout() {
        if(this.user != null) {
            this.todoService.logout().subscribe((res) => {
                this.user = null;
                this.error = null;
                this.loggedIn = false;

            }, (err) => {
                this.error = err;
            });
        } 
        else {
            throw new Error("Can't log out when not logged in.");
        }
    }
}