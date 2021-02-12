import mongoose, { Schema } from 'mongoose'

/**
 * GeoJSON is a format for storing geographic points and polygons
 *
 * Note that longitude comes first in a GeoJSON coordinate array, not latitude.
 *
 * @example { "type" : "Point", "coordinates" : [ -122.5, 37.7 ] }
 */
export const PointSchema = new Schema({
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
})
