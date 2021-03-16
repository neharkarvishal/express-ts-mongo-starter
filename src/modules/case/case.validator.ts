import Joi from 'joi'

/** Validation Schema, please updated respected Model when updating following */
export const createCaseSchema = Joi.object({
    status: Joi.string()
        .optional()
        .valid('OPEN', 'PENDING', 'CLOSED', 'ABANDONED', 'REOPENED')
        .default('OPEN')
        .label('Case Status'),

    type: Joi.string()
        .optional()
        .valid('INJURY', 'ABUSE', 'CLOSED', 'ATTACK', 'OTHER')
        .default('INJURY')
        .label('Case Type'),

    animalDetails: Joi.object({
        type: Joi.string()
            .required()
            .valid('DOG', 'CAT', 'UNKNOWN')
            .label('Animal Type'),

        name: Joi.string().min(2).max(38).optional().label('Animal Name'),

        image: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
            .optional()
            .label('Media Image'),

        color: Joi.string().min(2).max(38).optional().label('Animal Color'),

        identificationMark: Joi.string()
            .min(2)
            .max(60)
            .optional()
            .label('Animal Identification Mark'),
    })
        .required()
        .label('Animal Details'),

    description: Joi.string().optional().min(2).max(360).label('Address'),

    address: Joi.string().optional().min(2).max(360).label('Address'),

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

    addedBy: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('addedBy'),

    assignedTo: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('assignedTo'),

    assignedNgo: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('assignedNgo'),

    scheduled: Joi.date().iso().optional(),

    history: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id'))
        .optional(),
}).label('Cases validation schema')

/** Validation Schema, please updated respected Model when updating following */
export const updateCaseSchema = Joi.object({
    status: Joi.string()
        .optional()
        .valid('OPEN', 'PENDING', 'CLOSED', 'ABANDONED', 'REOPENED')
        .default('OPEN')
        .label('Case Status'),

    type: Joi.string()
        .optional()
        .valid('INJURY', 'ABUSE', 'CLOSED', 'ATTACK', 'OTHER')
        .default('INJURY')
        .label('Case Type'),

    animalDetails: Joi.object({
        type: Joi.string()
            .optional()
            .valid('DOG', 'CAT', 'UNKNOWN')
            .label('Animal Type'),

        name: Joi.string().min(2).max(38).optional().label('Animal Name'),

        image: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
            .optional()
            .label('Media Image'),

        color: Joi.string().min(2).max(38).optional().label('Animal Color'),

        identificationMark: Joi.string()
            .min(2)
            .max(60)
            .optional()
            .label('Animal Identification Mark'),
    })
        .optional()
        .label('Animal Details'),

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

    addedBy: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('addedBy'),

    assignedTo: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('assignedTo'),

    assignedNgo: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('assignedNgo'),

    scheduled: Joi.date().iso().optional(),

    history: Joi.array()
        // .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id'))
        .optional(),
}).label('Cases validation schema')

/** Validation Schema, please updated respected Model when updating following */
export const rescheduleCaseSchema = Joi.object({
    scheduled: Joi.date().iso().required(),
}).label('Cases validation schema')

// @ts-ignore
export type CreateCaseFields = Joi.extractType<typeof createCaseSchema>

// @ts-ignore
export type UpdateCaseFields = Joi.extractType<typeof updateCaseSchema>

// @ts-ignore
export type RescheduleCaseFields = Joi.extractType<typeof rescheduleCaseSchema>
