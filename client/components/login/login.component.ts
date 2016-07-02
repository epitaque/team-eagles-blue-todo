import {Component} from '@angular/core';
import {NgForm}    from '@angular/common';
import {TodoService} from '../../services/todo.service';

import {User} from '../../models/user';
import {LoginEvent} from '../../models/loginEvent';

@Component({
    selector: 'login',
    // we're using a separate html file this time because the form html is long
    templateUrl: 'components/login/login.component.html',
    styleUrls: ['styles/forms.css']
})
export class LoginComponent {
    public model: User;
    public submitted: boolean;
    public error: string;
    
    constructor(private todoService: TodoService) {
        this.model = new User();
        this.submitted = false;
    }

    onSubmit() { 
        this.submitted = true;
        this.todoService.login(this.model).subscribe((e: LoginEvent) => {
            if(e.error) {
                this.error = e.error;
            }
        });
    }
    get diagnostic() { return JSON.stringify(this.model); }
}