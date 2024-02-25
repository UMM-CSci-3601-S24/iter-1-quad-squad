import { Component, Input } from '@angular/core';
import { Task } from './task';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-task-list-element',
  templateUrl: './task-element.component.html',
  styleUrls: ['./task-element.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent]
})
export class TaskElementComponent {

  @Input() task: Task;
}

