import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { Earthquake } from '../shared/types';
import { UserInteractionsService } from '../services/user-interactions.service';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, map, startWith } from 'rxjs';

/**
 * Component responsible for displaying a list of earthquakes.
 */
@Component({
  selector: 'app-earthquake-list',
  templateUrl: './earthquake-list.component.html',
  styleUrls: ['./earthquake-list.component.scss'],
})
export class EarthquakesListComponent implements AfterViewInit {
  /**
   * The columns to be displayed in the earthquake list table.
   */
  displayedColumns: string[] = ['id', 'instant', 'type'];

  /**
   * Options for the page size in the pagination control.
   */
  pageSizeOptions = [25, 50, 100];

  /**
   * Observable representing the earthquake data to be displayed in the list.
   */
  earthquakesData$: Observable<Earthquake[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    protected readonly userInteractions: UserInteractionsService,
    protected readonly dataService: DataService
  ) {
    this.earthquakesData$ = this.dataService.earthquakesData$.pipe(
      map((renderEvent) => renderEvent.data)
    );

    this.userInteractions.playbackEvents$.subscribe((playbackEvent) => {
      if (playbackEvent === 'Play') {
        this.advancePageAfterTimeout();
      }
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(startWith({})).subscribe((_) => {
      this.dataService.getEarthQuakes(false, {
        limit: this.paginator.pageSize,
        skip: this.paginator.pageIndex * this.paginator.pageSize,
      });
    });
  }

  focusOnEarthquake(earthQuake: Earthquake | null) {
    this.userInteractions.focusOnEarthquake(earthQuake);
  }

  private advancePageAfterTimeout() {
    if (this.userInteractions.isInPlayback) {
      this.paginator.nextPage();
      setTimeout(() => this.advancePageAfterTimeout(), 1000);
    }
  }
}
