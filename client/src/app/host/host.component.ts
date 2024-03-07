import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Hunt } from '../hunt/hunt';
import { HuntService } from '../hunt/hunt.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';




@Component({
 selector: 'app-host',
 templateUrl: 'host.component.html',
 styleUrls: ['host.component.scss'],
 providers: [],
 standalone: true,
 imports: [RouterTestingModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule, MatOptionModule, MatRadioModule, MatListModule, RouterLink, MatButtonModule, MatTooltipModule, MatIconModule, CommonModule]
})






export class HostComponent implements OnInit, OnDestroy {


 public serverFilteredHunts: Hunt[];
 public HuntDescription: string;
 public taskHunt: Hunt;
 public huntChosen: Hunt;
 public HuntId: string;


 errMsg = '';
 private ngUnsubscribe = new Subject<void>();








 /**
  * @param userService the `UserService` used to get users from the server
  * @param snackBar the `MatSnackBar` used to display feedback
  */


 constructor(private router: Router, private huntService: HuntService, private snackBar: MatSnackBar, private route: ActivatedRoute) {
 }
 getHuntsFromServer(): void {
   this.huntService.getHunts()
     .pipe(
       takeUntil(this.ngUnsubscribe)
     ).subscribe({
       next: (returnedHunts) => {
         this.serverFilteredHunts = returnedHunts;
       },
       error: (err) => {
         if (err.error instanceof ErrorEvent) {
           this.errMsg = `Problem in the client – Error: ${err.error.message}`;
         } else {
           this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
         }
         this.snackBar.open(
           this.errMsg,
           'OK',
           // The message will disappear after 6 seconds.
           { duration: 6000 });
       },
     });
 }
 navigateToCreateHunt(): void {
   this.router.navigate(['/hunt/new/']);
 }


 ngOnInit(): void {
   this.getHuntsFromServer();
 }
 seeHuntDetails(huntDetails: string) {
   this.huntService.getHuntById(huntDetails)
     .pipe(
       takeUntil(this.ngUnsubscribe)
     ).subscribe({
       next: (returnedHunt) => {
         this.huntChosen = returnedHunt;
       }
   });
 }


 ngOnDestroy() {
   this.ngUnsubscribe.next();
   this.ngUnsubscribe.complete();
 }


}


