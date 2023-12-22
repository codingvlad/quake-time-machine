import { Component, OnInit } from '@angular/core';
import { UserInteractionsService } from '../services/user-interactions.service';
import { Earthquake, newBlankEarthquake } from '../shared/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Represents information for rendering earthquake details in the application.
 */
export interface RenderEarthQuakeDetail {
  /**
   * Indicates whether the earthquake being rendered is a new earthquake.
   */
  isNew: boolean;

  /**
   * The earthquake data to be rendered.
   */
  earthQuake: Earthquake;
}

/**
 * Represents the data structure for the earthquake form.
 */
export interface EarthquakeFormData {
  id: string;
  instant: string;
  date: string;
  time: string;
  type: string;
  depth: string;
  source: string | null;
  status: string | null;
  latitude: string;
  longitude: string;
  magnitudeType: string | null;
  magnitude: string | null;
  magnitudeError: string | null;
  magnitudeSource: string | null;
  magnitudeSeismicStations: string | null;
  depthError: string | null;
  depthSeismicStations: string | null;
  azimuthalGap: string | null;
  rootMeanSquare: string | null;
  locationSource: string | null;
  horizontalDistance: string | null;
  horizontalError: string | null;
}

/**
 * Component for displaying details of an earthquake, create new earthquakes or update existing ones.
 */
@Component({
  selector: 'app-earthquake-detail',
  templateUrl: './earthquake-detail.component.html',
  styleUrls: ['./earthquake-detail.component.scss'],
})
export class EarthquakeDetailComponent implements OnInit {
  /**
   * The title of the earthquake detail view.
   */
  protected title = '';

  /**
   * The identifier of the currently displayed earthquake.
   */
  private currentEarthquakeId = '';

  /**
   * The mode of the earthquake detail view.
   * Possible values: 'create', 'view', or 'edit'.
   */
  protected mode: 'create' | 'view' | 'edit' = 'view';

  /**
   * The form group representing the earthquake details form.
   */
  protected earthquakeForm!: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dataService: DataService,
    private readonly snackBar: MatSnackBar,
    protected readonly userInteractions: UserInteractionsService
  ) {}

  ngOnInit(): void {
    this.initializeForm({
      isNew: true,
      earthQuake: newBlankEarthquake(),
    });
    this.userInteractions.selectedEarthQuake$.subscribe((earthquake) => {
      if (earthquake !== null) this.initializeForm(earthquake);
    });
  }

  private initializeForm(detail: RenderEarthQuakeDetail) {
    if (detail.isNew === false) {
      this.currentEarthquakeId = detail.earthQuake.id;
    }
    this.mode = detail.isNew ? 'create' : 'view';
    this.title = detail.isNew ? 'New Earthquake' : detail.earthQuake.id;
    const geoJsonProperties = detail.earthQuake.geojson.properties;
    this.earthquakeForm = this.formBuilder.group({
      id: [
        { value: detail.earthQuake.id, disabled: this.mode === 'view' },
        Validators.required,
      ],
      instant: [detail.earthQuake.instant],
      date: [
        { value: geoJsonProperties.Date, disabled: this.mode === 'view' },
        Validators.required,
      ],
      time: [
        { value: geoJsonProperties.Time, disabled: this.mode === 'view' },
        Validators.required,
      ],
      type: [
        { value: geoJsonProperties.Type, disabled: this.mode === 'view' },
        Validators.required,
      ],
      depth: [
        { value: geoJsonProperties.Depth, disabled: this.mode === 'view' },
        Validators.required,
      ],
      source: [
        { value: geoJsonProperties.Source, disabled: this.mode === 'view' },
      ],
      status: [
        { value: geoJsonProperties.Status, disabled: this.mode === 'view' },
      ],
      latitude: [
        { value: geoJsonProperties.Latitude, disabled: this.mode === 'view' },
        Validators.required,
      ],
      longitude: [
        { value: geoJsonProperties.Longitude, disabled: this.mode === 'view' },
        Validators.required,
      ],
      magnitudeType: [
        {
          value: geoJsonProperties['Magnitude Type'],
          disabled: this.mode === 'view',
        },
      ],
      magnitude: [
        { value: geoJsonProperties.Magnitude, disabled: this.mode === 'view' },
        Validators.required,
      ],
      magnitudeError: [
        {
          value: geoJsonProperties['Magnitude Error'],
          disabled: this.mode === 'view',
        },
      ],
      magnitudeSource: [
        {
          value: geoJsonProperties['Magnitude Source'],
          disabled: this.mode === 'view',
        },
      ],
      magnitudeSeismicStations: [
        {
          value: geoJsonProperties['Magnitude Seismic Stations'],
          disabled: this.mode === 'view',
        },
      ],
      depthError: [
        {
          value: geoJsonProperties['Depth Error'],
          disabled: this.mode === 'view',
        },
      ],
      depthSeismicStations: [
        {
          value: geoJsonProperties['Depth Seismic Stations'],
          disabled: this.mode === 'view',
        },
      ],
      azimuthalGap: [
        {
          value: geoJsonProperties['Azimuthal Gap'],
          disabled: this.mode === 'view',
        },
      ],
      rootMeanSquare: [
        {
          value: geoJsonProperties['Root Mean Square'],
          disabled: this.mode === 'view',
        },
      ],
      locationSource: [
        {
          value: geoJsonProperties['Location Source'],
          disabled: this.mode === 'view',
        },
      ],
      horizontalDistance: [
        {
          value: geoJsonProperties['Horizontal Distance'],
          disabled: this.mode === 'view',
        },
      ],
      horizontalError: [
        {
          value: geoJsonProperties['Horizontal Error'],
          disabled: this.mode === 'view',
        },
      ],
    });
  }

  protected editEarthquake() {
    this.mode = 'edit';
    this.editableFields.forEach((fieldId) =>
      this.earthquakeForm.controls[fieldId].enable({ onlySelf: true })
    );
  }

  protected saveEarthquake() {
    const formValues = this.earthquakeForm.value;
    this.dataService
      .createEarthquake(this.createEarthquake(formValues))
      .subscribe({
        next: (_) => {
          this.openSnackBar('Earthquake saved successfully');
          this.userInteractions.hideEarthquakeDetail();
        },
        error: (_) => {
          this.openSnackBar('Earthquake failed to be saved');
        },
      });
  }

  protected updateEarthquake() {
    const formValues = this.earthquakeForm.value;
    this.dataService
      .updateEarthquake(formValues.id, this.createEarthquake(formValues))
      .subscribe({
        next: (_) => {
          this.openSnackBar('Earthquake updated successfully');
          this.userInteractions.hideEarthquakeDetail();
        },
        error: (_) => {
          this.openSnackBar('Earthquake failed to be updated');
        },
      });
  }

  protected deleteEarthquake() {
    this.dataService.deleteEarthquake(this.currentEarthquakeId).subscribe({
      next: (_) => {
        this.openSnackBar('Earthquake deleted successfully');
        this.userInteractions.hideEarthquakeDetail();
      },
      error: (_) => {
        this.openSnackBar('Earthquake failed to be deleted');
      },
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  private createEarthquake(formData: EarthquakeFormData): Earthquake {
    return {
      id: formData.id,
      instant: formData.instant,
      cluster: 0,
      geojson: {
        type: '',
        cluster: 0,
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(formData.latitude),
            parseFloat(formData.longitude),
          ],
        },
        properties: {
          ID: formData.id,
          Date: formData.date,
          Time: formData.time,
          Type: formData.type,
          Depth: parseFloat(formData.depth),
          Source: formData.source,
          Status: formData.status,
          Latitude: parseFloat(formData.latitude),
          Longitude: parseFloat(formData.longitude),
          Magnitude: parseFloat(formData.magnitude ?? ''),
          'Depth Error': formData.depthError
            ? parseFloat(formData.depthError)
            : null,
          'Azimuthal Gap': formData.azimuthalGap
            ? parseFloat(formData.azimuthalGap)
            : null,
          'Magnitude Type': formData.magnitudeType,
          'Location Source': formData.locationSource,
          'Magnitude Error': formData.magnitudeError
            ? parseFloat(formData.magnitudeError)
            : null,
          'Horizontal Error': formData.horizontalError
            ? parseFloat(formData.horizontalError)
            : null,
          'Magnitude Source': formData.magnitudeSource,
          'Root Mean Square': formData.rootMeanSquare
            ? parseFloat(formData.rootMeanSquare)
            : null,
          'Horizontal Distance': formData.horizontalDistance
            ? parseFloat(formData.horizontalDistance)
            : null,
          'Depth Seismic Stations': formData.depthSeismicStations,
          'Magnitude Seismic Stations': formData.magnitudeSeismicStations,
        },
      },
    };
  }

  private editableFields = [
    'id',
    'date',
    'time',
    'type',
    'depth',
    'source',
    'status',
    'latitude',
    'longitude',
    'magnitudeType',
    'magnitude',
    'magnitudeError',
    'magnitudeSource',
    'magnitudeSeismicStations',
    'depthError',
    'depthSeismicStations',
    'azimuthalGap',
    'rootMeanSquare',
    'locationSource',
    'horizontalDistance',
    'horizontalError',
  ];
}
