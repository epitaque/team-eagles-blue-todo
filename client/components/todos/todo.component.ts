import {Component, OnInit} from '@angular/core';
import {TodoService} from '../../services/todo.service';
import {Todo} from '../../models/TodoModel';

@Component({
    selector: 'todo',
    template: `<ul>
                    <li *ngFor="let todo of todos">
                        {{todo.}}
                    </li>
                </ul>
    `
})
export class TodoComponent {


    
}