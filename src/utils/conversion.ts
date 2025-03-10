import { LngLat } from "mapbox-gl";

export type Point = {
  x: number;
  y: number;
};

/**
 * Converts a physical map measurement from the top left corner of a map
 * with width and height (mapWidth, mapHeight) to a longitude and latitude coordinate.
 */
export function convertPhysicalMapMeasurementToLngLat(point: Point): LngLat {
  const convertedX = convertRange(point.x, [0, mapWidth], [-180, 180]);
  if (point.y === mapHeight || point.y === 0) {
    // account for poles, which will break the conversion functions
    return new LngLat(convertedX, point.y === 0 ? 90 : -90);
  }

  const convertedY = Gudermannian(
    convertRange(point.y, [0, mapHeight], [Math.PI, -Math.PI]),
  );

  return new LngLat(convertedX, convertedY);
}

/**
 * Converts a longitude and latitude coordinate back to a physical map measurement
 * from the top left corner of a map with width and height (mapWidth, mapHeight).
 */
export function convertLngLatToPhysicalMapMeasurement(lngLat: LngLat): Point {
  const convertedX = convertRange(lngLat.lng, [-180, 180], [0, mapWidth]);
  if (Math.abs(lngLat.lat) === 90) {
    // account for poles, which will break the conversion functions
    return {
      x: convertedX,
      y: lngLat.lat > 0 ? 0 : mapHeight,
    };
  }

  const convertedY = convertRange(
    GudermannianInv(lngLat.lat),
    [Math.PI, -Math.PI],
    [0, mapHeight],
  );

  return {
    x: convertedX,
    y: convertedY,
  };
}

/**
 * =====================================
 *
 * HELPER FUNCTIONS
 *
 * =====================================
 */

const mapWidth = 100;
const mapHeight = 64;

/**
 * convert number from _n_ of r1[0] .. r1[1] to _n_ of r2[0] .. r2[1]
 * @example `convertRange( 5, [0, 10], [0, 100] ) === 50`
 *
 * @param {number} value
 * @param {array<number>} r1 old range
 * @param {array<number>} r2 new range
 * @returns {number} value adjusted for new range
 */
function convertRange(
  value: number,
  r1: [number, number],
  r2: [number, number],
) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

/**
 * y must be in range [π, -π]
 */
function Gudermannian(y: number) {
  return Math.atan(Math.sinh(y)) * (180 / Math.PI);
}

/**
 * y must be in range [-90, 90]
 */
function GudermannianInv(latitude: number) {
  const sign = Math.sign(latitude);
  const sin = Math.sin(latitude * (Math.PI / 180) * sign);
  return sign * (Math.log((1 + sin) / (1 - sin)) / 2);
}
