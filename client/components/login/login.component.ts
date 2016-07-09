import {Component} from '@angular/core';
import {NgForm}    from '@angular/common';
import {TodoService} from '../../services/todo.service';
import {Router} from '@angular/router';

import {User} from '../../models/user';
import {LoginEvent} from '../../models/loginEvent';

@Component({
    selector: 'login',
    host: { 'class' : 'rcontaine'},
    providers: [TodoService],
    // we're using a separate html file this time because the form html is long
    templateUrl: 'components/login/login.component.html'
    //styleUrls: ['styles/forms.css']
})
export class LoginComponent {
    public model: User;
    public submitted: boolean;
    public error: string;
    
    constructor(private todoService: TodoService,
                private router: Router) {
        this.model = new User();
        this.submitted = false;
        this.todoService.loginStream.subscribe((e: LoginEvent)=> {
            if(e != null && !e.error) {
                this.router.navigate(['/todos']);
            }
        }).unsubscribe();
    }

    onSubmit() { 
        this.submitted = true;
        this.todoService.login(this.model).subscribe((e: LoginEvent) => {
            console.log("Logged in as ", e);
            if(e.error) {
                this.error = e.error;
            }
            else {
                console.log("navigating to /todos");
                this.router.navigate(['/todos']);
            }
        }, (error: string) => {
            this.error = error;
        });
    }
    get diagnostic() { return JSON.stringify(this.model); }
}