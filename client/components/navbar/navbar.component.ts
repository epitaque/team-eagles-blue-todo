import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, Event} from '@angular/router';
import {LoginEvent} from '../../models/LoginEvent';
import {User} from '../../models/User';
import {TodoService} from '../../services/todo.service';

@Component({
	selector: 'eagles-navbar',
	directives: [ROUTER_DIRECTIVES],
	templateUrl: 'components/navbar/navbar.component.html',
})
export class NavbarComponent {
	private loggedIn: boolean;
	private user: User;
	private error: string;
	private static scope: NavbarComponent;

    constructor(private router: Router, private todoService: TodoService, private _ngZone: NgZone) {
        NavbarComponent.scope = this;
        let scope = NavbarComponent.scope;
        this.todoService.loginStream.subscribe((e: LoginEvent) => {
            if(e == null) {
                this.user = null;
                this.error = null;

                this.loggedIn = false;
                this.router.navigate(['/login']);
            }
            else if(e.error) {
                scope.user = null;
                scope.error = e.error;
            }
            else {
                scope.error = null;
                scope.user = e.user;
                NavbarComponent.scope.loggedIn = true;
            }
        }, (err) => {
            console.log("Navbar loginStream error", err);
        }, () => {
            console.log("Navbar loginStream completed");
        });

        this.loggedIn = false;
    }

    private logout() {
        if(this.user != null) {
            this.todoService.logout();
        }
        else {
            this.error = "Can't log out when not logged in.";
            this.router.navigate(['/login']);
        }
    }
}