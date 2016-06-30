import {User} from './user';

export class LoginEvent {
	public error: string;
	public user: User;
}