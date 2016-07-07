import {Component, OnInit} from '@angular/core';
import {Todo} from '../../models/todoModel';
import {TodoService} from '../../services/todo.service';
import {TodoComponent} from './todo.component';

declare var $;

@Component({
    selector: 'todo-list',
	providers: [TodoService],
    directives: [TodoComponent],
    template:  `
    <div class="row" style="margin-top: 20px;">
        <div class="input-field col m8 s12">
            <input #in (keyup.enter)="addTodo({task: in.value, importance: im.value, completed: false})" type="text" id="todoInput">
            <label for="todoInput">Enter a new Todo</label>
        </div>
        <div class="input-field col m3 s6">
            <select #im>
                <option value="1" selected>Low Importance</option>
                <option value="2">Medium Importance</option>
                <option value="3">High Importance</option>
            </select>
            <label>Select Importance...</label>
        </div>
        <div class="input-field col m1 s1">
            <button (click)="addTodo({task: in.value, importance: im.value, completed: false})">Add</button>
        </div>
    </div>
	<ul>
		<li *ngFor="let todo of todos">
			<todo (importance)="todo.importance" [todo]="todo"></todo>
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
        $(document).ready(function() {
            $('select').material_select();
        });

        this.todoService.getTodos().subscribe((todos: Todo[]) => {
            TodoListComponent.scope.todos = todos;
            console.log("Todos: ", todos);
        }, (error: string) => {
            TodoListComponent.scope.error = error;
            console.log("TodoList Observable error: " + error);
        })
    }

    addTodo(todo: Todo): void {
        this.todoService.postTodo(todo);
    }
}