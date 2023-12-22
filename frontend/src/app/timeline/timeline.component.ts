import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {
  DEFAULT_MARGINS,
  SVGDimensions,
  createSvgDimensions,
} from '../shared/svg';
import { DataService, EarthQuakeRenderEvent } from '../services/data.service';

/**
 * Component that displays a timeline with an axis and a cursor
 * to represent the position in time and extension of the earthquake list data range.
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements AfterViewInit {
  /**
   * Reference to the timeline container element in the template.
   */
  @ViewChild('timelineContainer', { static: true })
  timelineContainer!: ElementRef;

  /**
   * The SVG element representing the timeline.
   */
  svg: any;

  /**
   * Dimensions of the SVG element.
   */
  svgDimensions!: SVGDimensions;

  /**
   * Maps a time range in milliseconds to the corresponding width size of a component.
   */
  private timeScale!: any;

  constructor(private readonly dataService: DataService) {}

  ngAfterViewInit(): void {
    this.initializeSvg();
    this.renderTimeline();
    this.renderDataWindow();
  }

  /**
   * Initialize dimensions based on the host component size.
   */
  private initializeSvg(): void {
    this.svg = d3.select('#timelineContainer');
    const svgElement = document.getElementById('timelineContainer');
    console.log(svgElement?.getBoundingClientRect());
    if (svgElement) {
      this.svgDimensions = createSvgDimensions(
        svgElement.getBoundingClientRect(),
        DEFAULT_MARGINS
      );
    }
  }

  /**
   * Appends the timeline axis to the svg.
   */
  private renderTimeline(): void {
    this.timeScale = d3
      .scaleTime()
      .domain([new Date(1963, 1, 1), new Date(2023, 1, 1)])
      .range([0, this.svgDimensions.width])
      .nice();

    const timeAxis = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
          this.svgDimensions.margins.left +
          ',' +
          (this.svgDimensions.height + this.svgDimensions.margins.top) +
          ')'
      )
      .call(
        this.createBottomAxis(this.timeScale, -(this.svgDimensions.height - 20))
      );

    timeAxis.selectAll('line').style('stroke', '#383838ff');

    timeAxis
      .selectAll('text')
      .attr('dy', -this.svgDimensions.height)
      .style('fill', '#383838ff')
      .each((d: any, i: any, nodes: []) => {
        if (i === 0) {
          d3.select(nodes[i]).attr('transform', 'translate(12,0)');
        } else if (i === nodes.length - 1) {
          d3.select(nodes[i]).attr('transform', 'translate(-12,0)');
        }
      });
  }

  private renderDataWindow(): void {
    const selectionWindow = this.svg
      .append('rect')
      .attr('class', 'selection-window')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 3)
      .style('stroke', 'none')
      .style('fill', '#FF8A65')
      .style('opacity', 0.9)
      .attr('height', this.svgDimensions.height);

    this.dataService.earthquakesData$.subscribe((quakeData) => {
      this.updateDataWindowPosition(selectionWindow, quakeData);
    });
  }

  private updateDataWindowPosition(
    cursor: any,
    quakeData: EarthQuakeRenderEvent
  ) {
    const earliestDate = new Date(quakeData.data[0].instant);
    const latestDate = new Date(
      quakeData.data[quakeData.data.length - 1].instant
    );

    const cursorX1 = this.timeScale(earliestDate);
    const cursorX2 = this.timeScale(latestDate);
    const windowWidth = cursorX2 - cursorX1 < 5 ? 5 : cursorX2 - cursorX1;
    cursor
      .attr('width', windowWidth)
      .attr('transform', `translate(${cursorX1}, 0)`);
  }

  /**
   * Creates a time axis.
   *
   * @param scale The scale of the axis.
   * @param tickHeightPixels Tick height in pixels.
   * @param tickLabelFormatting Tick label formatting function.
   */
  private createBottomAxis(scale: any, tickHeightPixels: number) {
    return d3
      .axisBottom(scale)
      .ticks(20)
      .tickPadding(15)
      .tickSize(tickHeightPixels);
  }
}
