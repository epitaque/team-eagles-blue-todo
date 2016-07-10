import {Component} from '@angular/core';
import {NgForm}    from '@angular/common';
import {TodoService} from '../../services/todo.service';
import {Router} from '@angular/router';

import {User} from '../../models/user';
import {LoginEvent} from '../../models/loginEvent';

@Component({
    selector: 'login',
    host: { 'class' : 'rcontaine'},
    // we're using a separate html file this time because the form html is long
    templateUrl: 'components/login/login.component.html',
    styleUrls: ['components/login/login.component.css']
    //styleUrls: ['styles/forms.css']
})
export class LoginComponent {
    public model: User;
    public submitted: boolean;
    public error: string;
    
    constructor(private todoService: TodoService,
                private router: Router) {
        this.model = new User();
        this.todoService.loginStream.subscribe((e: LoginEvent) => {
            if(e == null) {
                
            }
            else if(e.error) { 
                this.error = e.error;
            }
            else if (e.user) {
                router.navigate(['/todos']);
            }
            else {
                this.error = "Unknown error logging in.";
            }
        });
        this.submitted = false;
    }

    onSubmit() {
        this.todoService.login(this.model);
        this.submitted = true;
    }
    get diagnostic() { return JSON.stringify(this.model); }
}