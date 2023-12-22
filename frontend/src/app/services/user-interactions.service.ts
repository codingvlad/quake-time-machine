import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Earthquake, newBlankEarthquake } from '../shared/types';
import { RenderEarthQuakeDetail } from '../earthquake-detail/earthquake-detail.component';

/**
 * Service responsible for handling user interactions related to earthquake events.
 */
@Injectable({
  providedIn: 'root',
})
export class UserInteractionsService {
  /**
   * Flag indicating whether the application is currently in playback mode.
   * When true, the application is playing back earthquake events.
   */
  public isInPlayback = false;

  /**
   * Subject that emits information about the selected earthquake for rendering earthquake details.
   * The emitted data is of type `RenderEarthQuakeDetail | null`.
   * - If null, it indicates no earthquake is selected or should be rendered.
   * - If a `RenderEarthQuakeDetail` object is emitted, it contains information about the earthquake to render.
   */
  public selectedEarthQuake$: Subject<RenderEarthQuakeDetail | null> =
    new Subject();

  /**
   * Subject that emits information about the focused earthquake.
   * The emitted data is of type `Earthquake | null`.
   * - If null, it indicates no earthquake is currently focused.
   * - If an `Earthquake` object is emitted, it contains information about the focused earthquake.
   */
  public focusedEarthQuake$: Subject<Earthquake | null> = new Subject();

  /**
   * Subject that emits playback events for controlling the playback state.
   * The emitted data is of type `'Play' | 'Stop'`.
   * - If 'Play' is emitted, it indicates a request to start or resume playback.
   * - If 'Stop' is emitted, it indicates a request to stop or pause playback.
   */
  public playbackEvents$: Subject<'Play' | 'Stop'> = new Subject();

  constructor() {}

  /**
   * Creates a new earthquake event for rendering in the application.
   * This method sets the selectedEarthQuake$ subject to emit information about the new earthquake.
   */
  public createNewEarthQuake(): void {
    this.selectedEarthQuake$.next({
      isNew: true,
      earthQuake: newBlankEarthquake(),
    });
  }

  /**
   * Displays details for a specific earthquake event.
   * @param earthQuake - The earthquake event to display details for.
   */
  public showEarthQuakeDetails(earthQuake: Earthquake): void {
    this.selectedEarthQuake$.next({
      isNew: false,
      earthQuake,
    });
  }

  /**
   * Focuses on a specific earthquake.
   * @param earthQuake - The earthquake to focus on. Pass null to remove focus.
   */
  public focusOnEarthquake(earthQuake: Earthquake | null) {
    this.focusedEarthQuake$.next(earthQuake);
  }

  /**
   * Hides the detailed view of the earthquake event.
   */
  public hideEarthquakeDetail() {
    this.selectedEarthQuake$.next(null);
  }

  /**
   * Initiates playback of earthquake events.
   */
  public playback(): void {
    this.isInPlayback = true;
    this.playbackEvents$.next('Play');
  }

  /**
   * Pauses playback of earthquake events.
   */
  public pausePlayback() {
    this.isInPlayback = false;
    this.playbackEvents$.next('Stop');
  }
}
