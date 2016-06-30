// Handles all the HTTP requests of the todo application
// Includes logging in, logging out, registering, sending todos, and receiving todos

import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {JsonPipe, CORE_DIRECTIVES} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/subject';
import {Todo} from '../models/todoModel.ts';
import {LoginEvent} from '../models/loginEvent.ts';
import {User} from '../models/user.ts';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class TodoService {
	private registerUrl: string;
	private loginUrl: string;
	private logoutUrl: string;
	private getTodosUrl: string;

	public static todoStream: Subject<Todo>; // any new todos for the user will come through here
											 // when getTodos is called, all the todos are received
	public static loginStream: Subject<LoginEvent>; // any time you login (which happens when you register)
												    // you receive the User information through the LoginEvent
	public static logoutStream: Subject<boolean>; // any time you logout, a true boolean gets passed through
												  // here

	constructor(@Inject(Http) private http: Http) {
		this.registerUrl = 'http://localhost:3000/signup';
		this.loginUrl = 'http://localhost:3000/login';
		this.logoutUrl = 'http://localhost:3000/logout';
		this.getTodosUrl = 'http://localhost:3000/user/$id/getTodos';
	}

	public static initialize() {
		this.todoStream = new BehaviorSubject<Todo>(null);
		this.loginStream = new BehaviorSubject<LoginEvent>(null);
		this.logoutStream = new BehaviorSubject<boolean>(null);
	}

	public login(user: any): Observable<LoginEvent> {
		console.log("Trying to login...");
		
		let body = JSON.stringify({
			username: user.username,
			password: user.password
		});
		let headers = new Headers({'Content-Type': 'application/json'});
   		let options = new RequestOptions({ headers: headers });

		this.http.post(this.loginUrl, body, options)
			.map((res) => {
				let body = res.json();
				let login = new LoginEvent();
				
				login.error = body.error;
				if(!login.error && login.error != "")
				{
					login.user = new User();
					login.user.username = body
				}
				login.user = new User();
				return login;
			})
			.subscribe((login) => {
				TodoService.loginStream.next(login);
			});
		return TodoService.loginStream;
	}

	public logout(): Observable<boolean> {
		let body = JSON.stringify({});
		let headers = new Headers({'Content-Type': 'application/json'});
   		let options = new RequestOptions({ headers: headers });
		   
		this.http.post(this.logoutUrl, body, options).subscribe((res) => {
			TodoService.logoutStream.next(true);
		});
		return TodoService.logoutStream;
	}

	public register(user: any): Observable<Object> {
		console.log("Trying to register...");
		
		let body = JSON.stringify({
			email: user.email,
			username: user.username,
			password: user.password
		});
		let headers = new Headers({'Content-Type': 'application/json'});
   		let options = new RequestOptions({ headers: headers });
		
		return this.http.post(this.registerUrl, body, options).map((res) => {
			console.log("register Recieved res: " + JSON.stringify(res));
			return JSON.parse(JSON.stringify(res));
		});
	}
}