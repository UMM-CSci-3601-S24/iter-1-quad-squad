import { Component, Input } from '@angular/core';
import { Task } from './task';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-list-element',
  templateUrl: './task-element.component.html',
  styleUrls: ['./task-element.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, RouterLink]
})
export class TaskElementComponent {

  @Input() task: Task;
}

