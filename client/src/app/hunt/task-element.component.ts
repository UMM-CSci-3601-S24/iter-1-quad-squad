import { Component, Input } from '@angular/core';
import { Task } from './task';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent} from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'app-task-list-element',
  templateUrl: './task-element.component.html',
  styleUrls: ['./task-element.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, RouterLink, RouterTestingModule, MatListModule]
})
export class TaskElementComponent {
constructor() {}
  @Input() task: Task;
}

