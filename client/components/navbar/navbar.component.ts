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
        this.todoService.loginStream.subscribe((e: LoginEvent) => {
            console.log("Navbar loginStream pushed", e);
            if(e == null) {}
            else if(e.error) {
                this.user = null;
                this.error = e.error;
            }
            else {
                this.error = null;
                this.user = e.user;
                this.loggedIn = true;
            }
            //NavbarComponent.scope._ngZone.run(() => { NavbarComponent.scope.loggedIn = true; });
        }, (err) => {
            console.log("Navbar loginStream error", err);
        }, () => {
            console.log("Navbar loginStream completed");
        });
        this.loggedIn = false;
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