import {Component, OnInit} from '@angular/core';
import {Todo} from '../../models/todoModel';
import {TodoService} from '../../services/todo.service';
import {TodoComponent} from './todo.component';
import {Router} from '@angular/router';

@Component({
    selector: 'todo-list',
    directives: [TodoComponent],
    styleUrls: ['components/todos/todolist.component.css'],
    templateUrl: 'components/todos/todolist.component.html'
})
export class TodoListComponent implements OnInit {
    private static scope: TodoListComponent;
    private todos: Todo[];
    private error: string;

    constructor(private todoService: TodoService, 
            private router: Router) {
        TodoListComponent.scope = this;            
    }

    ngOnInit() {

        this.todoService.getTodos().subscribe((todos: Todo[]) => {
            TodoListComponent.scope.todos = todos;
        }, (error: string) => {
            TodoListComponent.scope.error = error;
            this.router.navigate(['/login']);
        })
    }

    addTodo(todo: Todo): void {
        this.todoService.postTodo(todo);
    }
}