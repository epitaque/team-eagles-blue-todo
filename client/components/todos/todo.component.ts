import {Component, Output, EventEmitter} from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../models/TodoModel';
import {TodoEdit} from '../../models/TodoEdit';

@Component({
    host: {
        'style': 'width: 100%'
    },
    selector: 'todo',
    inputs: ['todo'],
    styles: [`p { 
                word-wrap: break-word; 
            } 
            p:hover {
                background-color: #EDEDED;
            }`],
    template: `<div class="container" style="width: 100%">
                    <div class="g--1 no-margin-vertical">
                        <input class="g--1 no-margin-vertical" type="checkbox" (click)="editTodo()" [(ngModel)]="todo.completed">
                    </div>

                    <p *ngIf="!editMode" class="g--8 no-margin-vertical" (click)="enterEditMode()"> {{todo.task}} </p>
                    <div *ngIf="editMode" class="g--8 no-margin-vertical">
                        <div class="input-field">
                            <input id="todoInput" type="text" class="input-control" placeholder="Enter a new Todo item" #in (keyup.enter)="addTodo({task: in.value, importance: im.value, completed: false})" id="todoInput" placeholder="Enter a new Todo">
                            <span class="input-bar"></span>
                        </div>
                    </div>

                    <select class="g--2 no-margin-vertical" (change)="editTodo()" [(ngModel)]="todo.importance">
                        <option [selected]="todo.importance == 1">Low Importance</option>
                        <option [selected]="todo.importance == 2">Medium Importance</option>
                        <option [selected]="todo.importance == 3">High Importance</option>
                    </select>

                    <button class="btn--float" (click)="removeTodo()">-</button>
                </div>
    `
})
export class TodoComponent {
    @Output() todoUpdated = new EventEmitter<TodoEdit>();
    private todo: Todo;
    private editMode: boolean;

    editTodo(importance?: number) {
        if(importance) {this.todo.importance = importance};
        console.log("editing todo");
        this.todoUpdated.emit(new TodoEdit(false, this.todo));
    }

    enterEditMode() {

    }

    removeTodo() {
        this.todoUpdated.emit(new TodoEdit(true, this.todo));
    }
}