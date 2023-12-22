import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService, EarthQuakeRenderEvent } from '../services/data.service';
import { Earthquake } from '../shared/types';
import { UserInteractionsService } from '../services/user-interactions.service';

/**
 * Component responsible for rendering the Earth map and earthquakes.
 */
@Component({
  selector: 'app-earth-view',
  templateUrl: './earth-view.component.html',
  styleUrls: ['./earth-view.component.scss'],
})
export class EarthViewComponent implements AfterViewInit {
  /**
   * Reference to the map container element in the template.
   * The Earth map and earthquakes will be rendered within this container.
   */
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  /**
   * The SVG element representing the Earth map.
   */
  svg: any;

  /**
   * The projection used for positioning elements on the Earth map.
   */
  projection: any;

  constructor(
    private readonly userInteractions: UserInteractionsService,
    private readonly dataService: DataService
  ) {
    this.dataService.earthquakesData$.subscribe((renderEvent) => {
      this.renderEarthQuakes(renderEvent);
    });

    this.userInteractions.focusedEarthQuake$.subscribe((earthQuake) => {
      if (earthQuake === null) {
        this.svg.selectAll('.focused-earthquake').remove();
      } else {
        this.renderFocusedEarthQuake(earthQuake);
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderMap();
  }

  private renderMap(): void {
    const svgElement = this.mapContainer.nativeElement;
    this.svg = d3.select(svgElement);

    this.projection = d3
      .geoMercator()
      .scale(svgElement.clientWidth / (2 * Math.PI))
      .translate([svgElement.clientWidth / 2, svgElement.clientHeight / 2]);

    this.renderCountries(this.svg);
    //this.renderCluesters(svg, projection);
    //this.renderEarthQaukes(svg, projection);
  }

  private renderCountries(svg: any) {
    d3.json('/geojson/countries.geojson').then((data: any) => {
      const geoGenerator = d3.geoPath().projection(this.projection);

      svg
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', (path: any) =>
          geoGenerator(path as d3.GeoPermissibleObjects)
        )
        .attr('fill', '#DFDFDFff')
        .attr('stroke', '#f2f2f2ff');

      this.raiseEarthquakes();
    });
  }

  private raiseEarthquakes() {
    const earthquakes = this.svg.selectAll('.earthquake');
    earthquakes.raise();
  }

  // private renderCluesters(svg: any) {
  //   d3.csv('/geojson/clustered_earthquakes.csv').then((data) => {
  //     const sizeScale = d3
  //       .scaleLinear()
  //       .domain([0, d3.max(data, (d: any) => +d.count!) as number])
  //       .range([15, 45]);

  //     data.forEach((d: any) => {
  //       const p = this.projection([+d.Longitude, +d.Latitude]);
  //       d.projectedX = p?.[0];
  //       d.projectedY = p?.[1];
  //     });

  //     svg
  //       .selectAll('circle')
  //       .data(data)
  //       .enter()
  //       .append('circle')
  //       .attr('cx', (d: any) => d.projectedX)
  //       .attr('cy', (d: any) => d.projectedY)
  //       .attr('r', (d: any) => sizeScale(+d.count))
  //       .attr('fill', 'blue')
  //       .attr('opacity', 0.7);
  //   });
  // }

  private renderFocusedEarthQuake(earthQuake: Earthquake) {
    this.svg.selectAll('.earthquake').style('opacity', 0.7);
    this.svg.selectAll('.focused-earthquake').remove();

    this.svg
      .append('circle')
      .attr('class', 'focused-earthquake')
      .attr('cx', (e: any) => {
        const coordinates = this.projection(
          earthQuake.geojson.geometry.coordinates
        );
        return coordinates ? coordinates[0] : null;
      })
      .attr('cy', (e: any) => {
        const coordinates = this.projection(
          earthQuake.geojson.geometry.coordinates
        );
        return coordinates ? coordinates[1] : null;
      })
      .attr('r', 15)
      .style('fill', 'red');
  }

  private renderEarthQuakes(renderEvent: EarthQuakeRenderEvent) {
    this.removeAllEarthQuakes();
    //this.resizeAllEarthQaukes();

    const earthQuakeCircles = this.svg
      .selectAll('.earthquake')
      .data(renderEvent.data)
      .enter()
      .append('circle')
      .attr('class', 'earthquake')
      .attr('cx', (e: any) => {
        const coordinates = this.projection(e.geojson.geometry.coordinates);
        return coordinates ? coordinates[0] : null;
      })
      .attr('cy', (e: any) => {
        const coordinates = this.projection(e.geojson.geometry.coordinates);
        return coordinates ? coordinates[1] : null;
      })
      .attr('r', 7)
      .style('fill', (e: any) =>
        e.geojson.properties.Type === 'Earthquake' ? '#D84315' : '#FFFF00'
      );

    const tooltip = d3
      .select('body')
      .append('div')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('background', '#383838ff')
      .style('color', '#fff')
      .text('');

    earthQuakeCircles.text(
      (e: Earthquake) =>
        `Instant: ${e.instant}\nMagnitude: ${e.geojson.properties.Magnitude}\nLatitude: ${e.geojson.properties.Latitude}\nLongitude: ${e.geojson.properties.Longitude}`
    );

    // Add mouseover and mouseout event listeners to show/hide the tooltip
    earthQuakeCircles
      .on('mouseover', (event: any, e: Earthquake) => {
        tooltip.text(
          `Instant: ${e.instant}\nMagnitude: ${e.geojson.properties.Magnitude}\nLatitude: ${e.geojson.properties.Latitude}\nLongitude: ${e.geojson.properties.Longitude}`
        );
        return tooltip.style('visibility', 'visible');
      })
      .on('mousemove', (event: any) => {
        return tooltip
          .style('top', event.pageY - 10 + 'px')
          .style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', () => {
        return tooltip.style('visibility', 'hidden');
      })
      .on('click', (event: any, e: Earthquake) => {
        // Trigger your service to focus on the clicked earthquake
        this.userInteractions.showEarthQuakeDetails(e);
      });

    if (renderEvent.removeAfterTimeout || this.userInteractions.isInPlayback) {
      earthQuakeCircles.call(this.applyRippleEffect);
    }
  }

  private applyRippleEffect(selection: any) {
    selection
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      .attr('r', 20)
      .style('opacity', 0.2);
  }

  private applyRemoveEffect(selection: any) {
    selection
      .transition()
      .ease(d3.easeSinOut)
      .duration(500)
      .style('opacity', 0)
      .on('end', function (this: any) {
        d3.select(this).remove();
      });
  }

  private removeAllEarthQuakes() {
    this.svg.selectAll('.earthquake').remove(); //.call(this.applyRemoveEffect);
  }

  private resizeAllEarthQaukes() {
    this.svg.selectAll('.earthquake').attr('r', 3).style('opacity', 0.2);
  }
}
