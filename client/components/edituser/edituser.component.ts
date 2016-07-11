import {Component} from '@angular/core';
import {NgForm}    from '@angular/common';
import {TodoService} from '../../services/todo.service';
import {Router} from '@angular/router';

import {User} from '../../models/user';
import {LoginEvent} from '../../models/loginEvent';

@Component({
    selector: 'edituser',
    host: { 'class' : 'rcontaine'},
    templateUrl: 'components/edituser/edituser.component.html',
    styleUrls: ['styles/forms.css']
})
export class EditUserComponent {
    public model: User;
    public submitted: boolean;
    public error: string;
    
    constructor(private todoService: TodoService,
                private router: Router) {
		if(!this.todoService.loggedIn == true) {
			this.router.navigate(['/login']);
			return;
		}

		else {
			this.model = todoService.user;
			this.submitted = false;
			this.todoService.loginStream.subscribe((e: LoginEvent)=> {
				if(e == null || e.error || !e.user) {
					this.router.navigate(['/login']);
				}
			}).unsubscribe();
		}
    }

    onSubmit() { 
        this.submitted = true;
        console.log("Asking service to edit profile");
        this.todoService.editProfile(this.model).subscribe((e: any) => {
            if(e.error) {
                this.error = e.error;
            }
            else {
				this.todoService.checkUser();
                this.router.navigate(['/']);
            }
        }, (error: string) => {
            this.error = error;
        });
    }
}