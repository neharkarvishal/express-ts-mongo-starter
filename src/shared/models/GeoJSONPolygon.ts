import mongoose, { Schema } from 'mongoose'

/**
 * GeoJSON polygons let you define an arbitrary shape on a map
 *
 * Note that longitude comes first in a GeoJSON coordinate array, not latitude.
 *
 * An array of linear ring coordinate arrays
 * coordinates: Array<
 *                  LinearRingCoordinateArray<CoordinateArrays>
 *              >
 * @example { "type": "Polygon", "coordinates": [[ [-109, 41], [-102, 41], [-102, 37], [-109, 37], [-109, 41], ]] }
 */
export const PolygonSchema = new Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true,
    },
    coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of coordinate numbers
        required: true,
    },
})
