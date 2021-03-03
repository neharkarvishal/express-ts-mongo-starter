import Joi from 'joi'

/** Validation Schema, please updated respected Model when updating following */
export const createUserSchema = Joi.object({
    email: Joi.string().email().required().label('Email'),

    password: Joi.string().required().min(8).max(360).label('Password'),

    status: Joi.string()
        .optional()
        .valid('NOT_ACTIVATED', 'ACTIVATED', 'DISABLED', 'DELETED')
        .default('NOT_ACTIVATED')
        .label('User Status'),

    roles: Joi.array()
        .items(
            Joi.string()
                .optional()
                .valid('ADMIN', 'NGO_ADMIN', 'NGO_FO', 'VOLUNTEER', 'USER'),
        )
        .min(1)
        .optional()
        .label('User Type'),

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
}).label('Users validation schema')

/** Validation Schema, please updated respected Model when updating following */
export const loginUserSchema = Joi.object({
    email: Joi.string().email().required().label('Email'),

    password: Joi.string().required().min(8).max(360).label('Password'),
}).label('Users validation schema')

/** Validation Schema, please updated respected Model when updating following */
export const updateUserSchema = Joi.object({
    password: Joi.string().optional().min(8).max(360).label('Password'),

    status: Joi.string()
        .optional()
        .valid('NOT_ACTIVATED', 'ACTIVATED', 'DISABLED', 'DELETED')
        .default('NOT_ACTIVATED')
        .label('User Status'),

    roles: Joi.array()
        .items(
            Joi.string()
                .optional()
                .valid('ADMIN', 'NGO_ADMIN', 'NGO_FO', 'VOLUNTEER', 'USER'),
        )
        .optional()
        .label('User Type'),

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
}).label('Users validation schema')
