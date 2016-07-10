import {Component, OnInit} from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../models/TodoModel';

@Component({
    host: {
        'style': 'width: 100%'
    },
    selector: 'todo',
    inputs: ['todo'],
    outputs: ['todo'],
    styles: ['p { word-wrap: break-word; }'],
    template: `<div class="container" style="width: 100%" [style.background-color]="todo.completed ? 'gray' : 'transparent'">
                    <div class="g--1 no-margin-vertical">
                        <input class="g--1 no-margin-vertical" type="checkbox" [(ngModel)]="todo.completed">
                    </div>
                    <p class="g--8 no-margin-vertical"> {{todo.task}} </p>
                    <select class="g--3 no-margin-vertical" [(ngModel)]="todo.importance">
                        <option [selected]="importance == 1">Low Importance</option>
                        <option [selected]="importance == 2">Medium Importance</option>
                        <option [selected]="importance == 3">High Importance</option>
                    </select>
                </div>
    `
})
export class TodoComponent {
    private todo: Todo;
    constructor() {}
}