import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {LoginEvent} from '../../models/LoginEvent';
import {User} from '../../models/User';
import {TodoService} from '../../services/todo.service';

@Component({
	selector: 'eagles-navbar',
	directives: [ROUTER_DIRECTIVES],
	providers: [TodoService],
	templateUrl: 'components/navbar/navbar.component.html',
})
export class NavbarComponent {
	private loggedIn: boolean;
	private user: User;
	private error: string;
	private static scope: NavbarComponent;

    constructor(private todoService: TodoService, private _ngZone: NgZone) {
        todoService.loginStream.subscribe(this.onLogin);
        this.loggedIn = false;
        console.log("IsLoggedIn is now: ", this.loggedIn);
        NavbarComponent.scope = this;
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
            NavbarComponent.scope.user = null;
            NavbarComponent.scope.error = e.error;
        }
        else {
            NavbarComponent.scope.error = null;
            NavbarComponent.scope.user = e.user;
        }
        NavbarComponent.scope._ngZone.run(() => { NavbarComponent.scope.loggedIn = true; });
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
}