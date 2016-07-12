import {Component, OnInit} from '@angular/core';
import {Todo} from '../../models/todoModel';
import {TodoEdit} from '../../models/todoEdit';
import {TodoService} from '../../services/todo.service';
import {TodoComponent} from './todo.component';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'todo-list',
    directives: [TodoComponent],
    styleUrls: ['components/todos/todolist.component.css'],
    templateUrl: 'components/todos/todolist.component.html'
})
export class TodoListComponent implements OnInit {
    private todos: Todo[];
    private error: string;
    private editStream: Subject<TodoEdit>;
    private currentTodo: string;

    constructor(private todoService: TodoService, 
            private router: Router) {       
    }

    ngOnInit() {
        if(!this.todoService.loggedIn == true) {
            this.router.navigate(['/login']);
            return;
        }
        this.todoService.logoutStream.subscribe((e: boolean) => {
            if(e) {
                this.router.navigate(['/login']);
                return;
            }
        })

        this.todoService.getTodos();

        this.todoService.todoStream.subscribe((todos: Todo[]) => {
            console.log("TodoService pushed todos");
            this.todos = todos;
        }, (error: string) => {
            console.log("TodoService pushed error");
            this.error = error;
        }, () => {
            console.log("TodoService todo completed");
        });
    }

    todoUpdated(ev: TodoEdit) {
        if(ev.deleted) {
            this.todoService.deleteTodo(ev.todo);
        }
        else {
            console.log("editing todo 2");
            this.todoService.editTodo(ev.todo);
        }
    }

    addTodo(todo: Todo): void {
        console.log("Adding todo", todo);
        this.currentTodo = "";
        this.todoService.postTodo(todo);
    }
}