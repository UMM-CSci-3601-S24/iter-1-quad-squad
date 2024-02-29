import { Component, Input } from '@angular/core';
import { Hunt } from './hunt';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-hunt-list-element',
  templateUrl: './hunt-element.component.html',
  styleUrls: ['./hunt-element.component.scss'],
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent]
})
export class HuntElementComponent {

  @Input() hunt: Hunt;
}
