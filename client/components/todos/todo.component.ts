import {Component, OnInit} from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../models/TodoModel';

@Component({
    selector: 'todo',
    inputs: ['todo'],
    template: `<div [style.background-color]="todo.completed ? 'gray' : 'transparent'">
                    {{todo.task}}
                    {{todo.importance}}
                    <button (click)="setImportance(1)">Low Importance</button>
                    <button (click)="setImportance(2)">Moderate Importance</button>
                    <button (click)="setImportance(3)">High Importance</button>
                </div>
    `
})
export class TodoComponent {
    private todo: Todo;
    private importance: number;
    constructor() {
    }

    private setImportance(importance: number): void {
        this.importance = importance;
        this.todo.importance = importance;
    }
}