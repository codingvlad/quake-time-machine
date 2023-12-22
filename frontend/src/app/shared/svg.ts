/**
 * Interface representing the margins inside an SVG element.
 */
export interface SVGMargins {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export const DEFAULT_MARGINS: SVGMargins = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

/**
 * Interface representing the dimensions of an SVG element.
 */
export interface SVGDimensions {
  height: number;
  width: number;
  margins: SVGMargins;
}

/**
 * Creates an SVGDimensions instance from the given DOMRect and SVGMargins.
 *
 * @param domRect The bounding DOMRect of an element.
 * @param margins The svg marghins to apply.
 */
export function createSvgDimensions(
  domRect: DOMRect,
  margins: SVGMargins
): SVGDimensions {
  return {
    margins,
    width: domRect.width - margins.left - margins.right,
    height: domRect.height - margins.bottom - margins.top,
  };
}
