import {Component} from '@angular/core';
import {Todo} from '../../models/todoModel';
import {TodoService} from '../../services/todo.service';
import {TodoComponent} from './todo.component.ts';

@Component({
    selector: 'todo-list',
    template:  `
	<ul>
		<li *ngFor="let todo of todos">

		</li>
	</ul>`
})
export class TodoListComponent {
	todos: Todo[];

	constructor() {

	}
}