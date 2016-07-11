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
                            <input [(ngModel)]="todo.task" type="text" class="input-control" (keyup.enter)="editTodo(); leaveEditMode();" placeholder="Edit your todo">
                            <span class="input-bar"></span>
                        </div>
                    </div>

                    <select class="g--2 #sl no-margin-vertical" [(ngModel)]="todo.importance" (change)="editTodo()">
                        <option [value]="1" value="1" [selected]="todo.importance == 1">Low Importance</option>
                        <option [value]="2" value="2" [selected]="todo.importance == 2">Medium Importance</option>
                        <option [value]="3" value="3" [selected]="todo.importance == 3">High Importance</option>
                    </select>

                    <button class="btn--float" (click)="removeTodo()">-</button>
                </div>
    `
})
export class TodoComponent {
    @Output() todoUpdated = new EventEmitter<TodoEdit>();
    private todo: Todo;
    private editMode: boolean;

    private editTodo(importance?: number) {
        if(importance) {this.todo.importance = importance};
        console.log("editing todo", JSON.stringify(importance));
        setTimeout(() => {
            this.todoUpdated.emit(new TodoEdit(false, this.todo));
            return null;
        }, 100);
    }

    private enterEditMode() {
        this.editMode = true;
    }

    private leaveEditMode() {
        this.editMode = false;
    }

    private removeTodo() {
        this.todoUpdated.emit(new TodoEdit(true, this.todo));
    }
}