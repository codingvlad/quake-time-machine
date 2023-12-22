export interface Earthquake {
  id: string;
  instant: string;
  cluster: number;
  geojson: GeoJson;
}

export interface GeoJsonGeometry {
  type: string;
  coordinates: number[];
}

export interface GeoJsonProperties {
  ID: string;
  Date: string;
  Time: string;
  Type: string;
  Depth: number;
  Source: string | null;
  Status: string | null;
  Latitude: number;
  Longitude: number;
  Magnitude: number | null;
  'Depth Error': number | null;
  'Azimuthal Gap': number | null;
  'Magnitude Type': string | null;
  'Location Source': string | null;
  'Magnitude Error': number | null;
  'Horizontal Error': number | null;
  'Magnitude Source': string | null;
  'Root Mean Square': number | null;
  'Horizontal Distance': number | null;
  'Depth Seismic Stations': string | null;
  'Magnitude Seismic Stations': string | null;
}

export interface GeoJson {
  type: string;
  cluster: number;
  geometry: GeoJsonGeometry;
  properties: GeoJsonProperties;
}

export function newBlankEarthquake(): Earthquake {
  const currentDateTime = new Date();
  return {
    id: '',
    instant: currentDateTime.toISOString(),
    cluster: 0,
    geojson: {
      type: '',
      cluster: 0,
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {
        ID: '',
        Date: currentDateTime.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }),
        Time: currentDateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
        Type: 'Earthquake',
        Depth: 0,
        Source: '',
        Status: '',
        Latitude: 0,
        Longitude: 0,
        Magnitude: 0,
        'Depth Error': null,
        'Azimuthal Gap': null,
        'Magnitude Type': '',
        'Location Source': '',
        'Magnitude Error': null,
        'Horizontal Error': null,
        'Magnitude Source': '',
        'Root Mean Square': null,
        'Horizontal Distance': null,
        'Depth Seismic Stations': null,
        'Magnitude Seismic Stations': null,
      },
    },
  };
}
