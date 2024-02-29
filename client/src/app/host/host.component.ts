import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-host',
  providers: [HttpClient],
  standalone: true,
  imports: [MatCardModule, CommonModule, HttpClientModule],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})
export class HostComponent implements OnInit {
  hunts: any[];
  showCreateForm: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('assets/hunt-data.json').subscribe(data => {
      this.hunts = data;
    });
  }
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

}

