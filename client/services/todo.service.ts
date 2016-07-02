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
	private getTodosUrl: string;

	public loginStream: BehaviorSubject<LoginEvent>;

	constructor(@Inject(Http) private http: Http) {
		let baseUrl = 'http://localhost:8080/';

		this.registerUrl = baseUrl + 'signup';
		this.loginUrl = baseUrl + 'login';
		this.logoutUrl = baseUrl + 'logout';
		this.getTodosUrl = baseUrl + 'todos';

		this.loginStream = new BehaviorSubject<LoginEvent>(null);
	}

	public login(user: User): Observable<LoginEvent> {
		console.log("Trying to login...");
		
		let body = JSON.stringify({
			username: user.username,
			password: user.password
		});
		console.log("Logging in with body: ", body);

		let headers = new Headers({'Content-Type': 'application/json'});
   		let options = new RequestOptions({ headers: headers });

		return this.http.post(this.loginUrl, body, options)
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
				} // no .user or .error but its not empty
				else {
					login.error = "Unrecognized response from server: " + body;
				}
				this.loginStream.next(login);
				return login;
			});
	}

	public logout(): Observable<any> {
		let body = JSON.stringify({});
		let headers = new Headers({'Content-Type': 'application/json'});
   		let options = new RequestOptions({ headers: headers });
		   
		return this.http.post(this.logoutUrl, body, options).map((res: Response) => {
			return this.extractData(res);
		});
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
			return this.extractData(res);
		});
	}

	private extractData(res: Response) {
		let body = res.json();
		return body.data || { };
	}

	private handleError (error: any) {
		// In a real world app, we might use a remote logging infrastructure
		// We'd also dig deeper into the error to get a better message
		let errMsg = (error.message) ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}
}