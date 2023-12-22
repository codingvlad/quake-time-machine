import { Component } from '@angular/core';
import { UserInteractionsService } from './services/user-interactions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * The title of the application.
   */
  title = 'Quake Time Machine';

  /**
   * Flag to control the visibility of earthquake details.
   */
  showEarthQuakeDetail = false;

  constructor(protected readonly userInteractions: UserInteractionsService) {
    this.userInteractions.selectedEarthQuake$.subscribe((earthQuake) => {
      if (earthQuake === null) {
        this.showEarthQuakeDetail = false;
      } else {
        this.showEarthQuakeDetail = true;
      }
    });
  }
}
