import Joi from 'joi'

/** Validation Schema, please updated respected Model when updating following */
export const createNGOSchema = Joi.object({
    description: Joi.string().optional().min(2).max(360).label('Address'),

    address: Joi.string().optional().min(2).max(360).label('Address'),

    phoneNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .optional()
        .label('Phone Number'),

    alternatePhoneNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .optional()
        .label('Alternate Phone Number'),

    /** @example { "type" : "Point", "coordinates" : [ -122.5, 37.7 ] } */
    point: Joi.object({
        type: Joi.string().required().valid('Point'),

        coordinates: Joi.array()
            .required()
            .ordered(
                Joi.number().min(-180).max(180).required().label('longitude'),
                Joi.number().min(-90).max(90).required().label('latitude'),
            )
            .label('coordinates'),
    })
        .label('point')
        .optional()
        .description('Please use this format [ longitude, latitude]'),

    /**
     * An array of linear ring coordinate arrays
     * coordinates: Array<
     *                  LinearRingCoordinateArray<CoordinateArrays>
     *              >
     * @example { "type": "Polygon", "coordinates": [[ [-109, 41], [-102, 41], [-102, 37], [-109, 37], [-109, 41], ]] }
     */
    area: Joi.object({
        type: Joi.string().required().valid('Polygon'),

        coordinates: Joi.array() // type: [[[Number]]]
            .required()
            .items(
                Joi.array()
                    .required()
                    .items(
                        Joi.array()
                            .required()
                            .ordered(
                                Joi.number()
                                    .min(-180)
                                    .max(180)
                                    .required()
                                    .label('longitude'),
                                Joi.number()
                                    .min(-90)
                                    .max(90)
                                    .required()
                                    .label('latitude'),
                            )
                            .description(
                                'Please use this format [ longitude, latitude]',
                            )
                            .label('coordinates-later-2'),
                    )
                    .label('coordinates-later-1'),
            )
            .label('coordinates-layer-0'),
    })
        .required()
        .label('area'),
}).label('NGOs validation schema')

/** Validation Schema, please updated respected Model when updating following */
export const updateNGOSchema = Joi.object({
    description: Joi.string().optional().min(2).max(360).label('description'),

    address: Joi.string().optional().min(2).max(360).label('address'),

    /** @example { "type" : "Point", "coordinates" : [ -122.5, 37.7 ] } */
    point: Joi.object({
        type: Joi.string().required().valid('Point'),

        coordinates: Joi.array()
            .required()
            .ordered(
                Joi.number().min(-180).max(180).required().label('longitude'),
                Joi.number().min(-90).max(90).required().label('latitude'),
            )
            .label('coordinates'),
    })
        .label('point')
        .optional()
        .description('Please use this format [ longitude, latitude]'),

    /**
     * An array of linear ring coordinate arrays
     * coordinates: Array<
     *                  LinearRingCoordinateArray<CoordinateArrays>
     *              >
     * @example { "type": "Polygon", "coordinates": [[ [-109, 41], [-102, 41], [-102, 37], [-109, 37], [-109, 41], ]] }
     */
    area: Joi.object({
        type: Joi.string().required().valid('Polygon'),

        coordinates: Joi.array() // type: [[[Number]]]
            .required()
            .items(
                Joi.array()
                    .required()
                    .items(
                        Joi.array()
                            .required()
                            .ordered(
                                Joi.number()
                                    .min(-180)
                                    .max(180)
                                    .required()
                                    .label('longitude'),
                                Joi.number()
                                    .min(-90)
                                    .max(90)
                                    .required()
                                    .label('latitude'),
                            )
                            .description(
                                'Please use this format [ longitude, latitude]',
                            )
                            .label('coordinates-later-2'),
                    )
                    .label('coordinates-later-1'),
            )
            .label('coordinates-layer-0'),
    })
        .optional()
        .label('area'),
}).label('NGOs validation schema')
