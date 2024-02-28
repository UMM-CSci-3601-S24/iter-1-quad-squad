import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-host',
  providers: [],
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})
export class HostComponent implements OnInit {
  hunts: any[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('assets/hunt-data.json').subscribe(data => {
      this.hunts = data;
    });
  }
}

