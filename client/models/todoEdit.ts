import {Todo} from './todoModel';
export class TodoEdit {
	public deleted: boolean;
	public todo: Todo;

	constructor(deleted?: boolean, todo?: Todo) {
		this.deleted = deleted;
		this.todo = todo;
	}
}