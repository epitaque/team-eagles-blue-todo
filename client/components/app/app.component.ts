import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TodoService} from '../../services/todo.service';
import {LoginEvent} from '../../models/LoginEvent';
import {User} from '../../models/User';
import {NgIf} from '@angular/common';
import {OnInit} from '@angular/core';

declare var jQuery: any;

@Component({
    selector: 'main-app',
    providers: [TodoService],
    directives: [ROUTER_DIRECTIVES, NgIf],
    templateUrl: 'components/app/app.component.html'
})
export class AppComponent implements OnInit {
    public user: User;
    public error: string;
    public loggedIn: boolean;
    public static scope: AppComponent;

    constructor(private todoService: TodoService, private _ngZone: NgZone) {
        todoService.loginStream.subscribe(this.onLogin);
        this.loggedIn = false;
        console.log("IsLoggedIn is now: ", this.loggedIn);
        AppComponent.scope = this;
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
            AppComponent.scope.user = null;
            AppComponent.scope.error = e.error;
        }
        else {
            AppComponent.scope.error = null;
            AppComponent.scope.user = e.user;
        }
        AppComponent.scope._ngZone.run(() => { AppComponent.scope.loggedIn = true; });
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

    click1() {
    }

    click2() {
    }

    ngOnInit() {

    }
}
