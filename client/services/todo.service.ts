// Handles all the HTTP requests of the todo application
// Includes logging in, logging out, registering, sending todos, and receiving todos

import {Injectable, Inject} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {JsonPipe, CORE_DIRECTIVES} from '@angular/common';
import {Todo} from '../models/todoModel';
import {LoginEvent} from '../models/loginEvent';
import {User} from '../models/user';

// rxjs
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import '../components/app/rxjs-operators';

@Injectable()
export class TodoService {
	private registerUrl: string;
	private loginUrl: string;
	private logoutUrl: string;
	private checkUserUrl: string;
	private getTodosUrl: string;
	private postTodosUrl: string;
	private todos: Todo[];

	public loggedIn: boolean;
	public user: User;
	public loginStream: BehaviorSubject<LoginEvent>;
	public todoStream: BehaviorSubject<Todo[]>;

	constructor(@Inject(Http) private http: Http) {
		console.log("TodoService", Math.random(), " instantiated.");

		let baseUrl = 'http://localhost:8080/';

		this.registerUrl = baseUrl + 'signup';
		this.loginUrl = baseUrl + 'login';
		this.logoutUrl = baseUrl + 'logout';
		this.getTodosUrl = baseUrl + 'todo';
		this.postTodosUrl = baseUrl + 'todo';
		this.checkUserUrl = baseUrl + 'self';

		this.loginStream = new BehaviorSubject<LoginEvent>(null);
		this.loginStream.subscribe((e) => {
			console.log("LoginStream pushed: ", e);
		})
		this.todoStream = new BehaviorSubject<Todo[]>([]);
		this.checkUser();
	}

	public checkUser(): BehaviorSubject<LoginEvent> {
		console.log("checking if user exists...");
		this.http.get(this.checkUserUrl)
			.map((res: Response) => {
				return res.json();
			})
			.subscribe((body: any) => {
				console.log("checkUser res: ", body);
				if(body.message) {
					this.loggedIn = false;
					this.user = null;
					console.log("it doesn't. error: ", body.message);
				}
				else if(body.username && body.email) {
					console.log("it does!: ", body.username, body.email );
					this.user = new User;
					this.user.email = body.email;
					this.user.username = body.username;
					let e: LoginEvent = new LoginEvent();
					e.user = this.user;
					console.log("Pushing this event to loginStream: ", e);
					this.loginStream.next(e);
					this.loggedIn = true;
				}
				return;
			})
		return this.loginStream;
	}

	public login(user: User): BehaviorSubject<LoginEvent> {
		console.log("Trying to login...");
		
		let body = JSON.stringify({
			loginUser: {
				username: user.username,
				password: user.password
			}
		});
		console.log("Logging in with body: ", body);

		let headers = new Headers({
				'Content-Type': 'application/json'
			});
   		let options = new RequestOptions({ headers: headers });

		this.http.post(this.loginUrl, body, options)
			.map((res) => {
				let body = res.json();
				let login = new LoginEvent();
				
				console.log(JSON.stringify(body));

				// if the response body is empty, set login.error
				if(Object.keys(body).length === 0 && body.constructor === Object) {
					login.error = "Empty response from server.";
				} // or if the server sent an error, set login.error to that
				else if(body.error){
					login.error = body.error;
				} // no error? alright, set the user
				else if(body.username)
				{
					login.user = new User();
					login.user.username = body.username;
					login.user.email = body.email;
					this.loggedIn = true;
					this.user = user;
				} // no .user or .error but its not empty
				else {
					login.error = "Unrecognized response from server: " + body;
				}
				return login;
			})
			.subscribe((e: LoginEvent) => {
				this.loginStream.next(e);
			});
		return this.loginStream;
	}

	public logout(): BehaviorSubject<LoginEvent> {
		console.log("Logging out...");
		this.http.get(this.logoutUrl)
			.map(this.extractData)
			.subscribe((body: any) => {
				if(!body.error)
					this.loggedIn = false;
					this.user = null;
					this.loginStream.next(null);
			});
		return this.loginStream;
	}

	public register(user: any): Observable<Object> {
		console.log("Trying to register...");
		
		let body = JSON.stringify({
			newUser: {
				email: user.email,
				username: user.username,
				password: user.password
			}
		});
		let headers = new Headers({
				'Content-Type': 'application/json'
			});
   		let options = new RequestOptions({ headers: headers });
		
		return this.http.post(this.registerUrl, body, options)
			.map(this.extractData);
	}

	public getTodos(): BehaviorSubject<Todo[]> {
		let headers = new Headers({
				'Content-Type': 'application/json'
			});
   		let options = new RequestOptions({ headers: headers });


		this.http.get(this.getTodosUrl, options)
			.map((res: Response) => {
				console.log("Response: ", res);
				console.log("Response as json: ", res.json());
				return res.json();
			})
			.subscribe((data) => {
				if(data.message) {
					this.todoStream.error(data.message);
					return;
				}
				else if(data.error) {
					this.todoStream.error(data.error);
					return;
				}
				this.todos = data;
				this.todoStream.next(data);
			});
		return this.todoStream;
	}
	
	public postTodo(todo: Todo): BehaviorSubject<Todo[]> {
		let body = JSON.stringify({
			newTodo: todo
		});
		let headers = new Headers({
				'Content-Type': 'application/json'
			});
   		let options = new RequestOptions({ headers: headers });


		this.http.post(this.postTodosUrl, body, options)
			.map((res: Response) => {
				return this.extractData(res);
			})
			.subscribe((body: Object) => {
				this.getTodos();
			});
		return this.todoStream;
	}

	private extractData(res: Response) {
		console.log("extracting data: ", res);
		let body = res.json();
		return body.data || { };
	}
}