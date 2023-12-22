import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, first, tap } from 'rxjs';
import { Earthquake } from '../shared/types';

/**
 * Represents an event used to render earthquake data in the application.
 */
export interface EarthQuakeRenderEvent {
  /**
   * Indicates whether the rendered earthquake events should be removed after a certain timeout.
   * Removal should be activated when the application playback the earthquakes data.
   */
  removeAfterTimeout: boolean;

  /**
   * An array of earthquake data to be rendered.
   */
  data: Earthquake[];
}

/**
 * Represents parameters for querying a list of earthquakes.
 */
export interface QueryEarthquakesListParams {
  /**
   * The maximum number of earthquakes to retrieve.
   */
  limit?: number;

  /**
   * The number of earthquakes to skip before starting to return earthquakes.
   */
  skip?: number;

  /**
   * The timestamp in milliseconds to filter earthquakes based on their occurrence time.
   */
  milliseconds?: number;
}

/**
 * Service responsible for managing earthquake data from an API endpoint.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * The base URL of the earthquakes API endpoint.
   */
  private earthquakesApiUrl = 'http://localhost:8000/earthquakes/';

  /**
   * Caches the last set of parameters used for querying earthquakes.
   * Used for the playback/pause scenario.
   * If null, no previous query has been made.
   */
  private lastEarthquakesQueryParams: QueryEarthquakesListParams | null = null;

  /**
   * Subject for emitting earthquake data events to be rendered in the application.
   */
  public earthquakesData$: Subject<EarthQuakeRenderEvent> = new Subject();

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a list of earthquakes from the API based on the provided query parameters.
   * @param removeAfterTimeout - Indicates whether the rendered earthquake events should be removed after a certain timeout.
   * @param queryParams - Parameters for querying earthquakes, including limit, skip, and milliseconds.
   */
  getEarthQuakes(
    removeAfterTimeout: boolean,
    queryParams: QueryEarthquakesListParams
  ): void {
    let params = new HttpParams();
    if (queryParams.limit !== undefined) {
      params = params.set('limit', queryParams.limit.toString());
    }
    if (queryParams.skip !== undefined) {
      params = params.set('skip', queryParams.skip.toString());
    }
    if (queryParams.milliseconds !== undefined) {
      params = params.set('milliseconds', queryParams.milliseconds.toString());
    }

    this.http
      .get<Earthquake[]>(this.earthquakesApiUrl, { params })
      .pipe(first())
      .subscribe((results) =>
        this.earthquakesData$.next({
          removeAfterTimeout,
          data: results,
        })
      );
  }

  /**
   * Creates a new earthquake by sending a POST request to the API.
   * @param earthquake - The earthquake object to be created.
   */
  createEarthquake(earthquake: Earthquake) {
    return this.http.post(this.earthquakesApiUrl, earthquake).pipe(
      tap(() => {
        if (this.lastEarthquakesQueryParams !== null) {
          this.getEarthQuakes(false, this.lastEarthquakesQueryParams);
        }
      })
    );
  }

  /**
   * Retrieves details of a specific earthquake by sending a GET request to the API.
   * @param id - The identifier of the earthquake to retrieve details for.
   */
  getEarthquakeDetails(id: string) {
    const detailsUrl = `${this.earthquakesApiUrl}${id}`;
    return this.http.get<Earthquake>(detailsUrl);
  }

  /**
   * Updates an existing earthquake by sending a PUT request to the API.
   * @param id - The identifier of the earthquake to update.
   * @param earthquake - The updated earthquake.
   */
  updateEarthquake(id: string, earthquake: Earthquake) {
    const updateUrl = `${this.earthquakesApiUrl}${id}`;
    return this.http.put(updateUrl, earthquake).pipe(
      tap(() => {
        if (this.lastEarthquakesQueryParams !== null) {
          this.getEarthQuakes(false, this.lastEarthquakesQueryParams);
        }
      })
    );
  }

  /**
   * Deletes a specific earthquake by sending a DELETE request to the API.
   * @param id - The identifier of the earthquake to delete.
   */
  deleteEarthquake(id: string): Observable<any> {
    const deleteUrl = `${this.earthquakesApiUrl}${id}`;
    return this.http.delete(deleteUrl).pipe(
      tap(() => {
        if (this.lastEarthquakesQueryParams !== null) {
          this.getEarthQuakes(false, this.lastEarthquakesQueryParams);
        }
      })
    );
  }
}
