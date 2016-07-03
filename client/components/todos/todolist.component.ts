import {Component, OnInit} from '@angular/core';
import {Todo} from '../../models/todoModel';
import {TodoService} from '../../services/todo.service';
import {TodoComponent} from './todo.component';

@Component({
    selector: 'todo-list',
	providers: [TodoService],
    template:  `
	<ul>
		<li *ngFor="let todo of todos">
			{{ todo.text }}
			{{ todo.importance }}
		</li>
	</ul>`
})
export class TodoListComponent implements OnInit {
    private static scope: TodoListComponent;
    private todos: Todo[];
    private error: string;

    constructor(private todoService: TodoService) {
        TodoListComponent.scope = this;
    }

    ngOnInit() {
        this.todoService.getTodos().subscribe((todos: Todo[]) => {
            TodoListComponent.scope.todos = todos;
        }, (error: string) => {
            TodoListComponent.scope.error = error;
        })
    }
}