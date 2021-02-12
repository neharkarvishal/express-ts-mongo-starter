import Joi from 'joi'

/** Validation Schema */
export const caseSchema = Joi.object({
    animalDetails: Joi.object({
        type: Joi.string()
            .required()
            .valid('DOG', 'CAT', 'UNKNOWN')
            .label('Animal Type'),

        name: Joi.string().min(2).max(38).optional().label('Animal Name'),

        color: Joi.string().min(2).max(38).optional().label('Animal Color'),

        identificationMark: Joi.string()
            .min(2)
            .max(60)
            .optional()
            .label('Animal Identification Mark'),
    })
        .required()
        .label('Animal Details'),

    description: Joi.string().min(2).max(360).label('Address'),

    address: Joi.string().min(2).max(360).label('Address'),

    phoneNumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required()
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
        .required()
        .description('Please use this format [ longitude, latitude]'),

    /**
     * An array of linear ring coordinate arrays
     * coordinates: Array<
     *                  LinearRingCoordinateArray<CoordinateArrays>
     *              >
     * @example { "type": "Polygon", "coordinates": [[ [-109, 41], [-102, 41], [-102, 37], [-109, 37], [-109, 41], ]] }
     */
    area: Joi.object({
        type: Joi.string().valid('Polygon'),

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
}).label('Cases validation schema')
