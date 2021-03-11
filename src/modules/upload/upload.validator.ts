import Joi from 'joi'

/** Validation Schema, please updated respected Model when updating following */
export const uploadSchema = Joi.object({
    type: Joi.string()
        .required()
        .valid('IMAGE', 'VIDEO', 'SOUND', 'DOC')
        .default('IMAGE')
        .label('Upload Type'),

    url: Joi.string().uri().optional().label('Url'),

    sizeHuman: Joi.string().uri().optional().label('File size text'),

    size: Joi.number().optional().label('File size'),

    title: Joi.string().optional().min(2).max(360).label('Title'),

    addedBy: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('addedBy'),

    referer: Joi.object({
        type: Joi.string()
            .required()
            .valid('CASE', 'USER', 'NGO')
            .label('Referer Type'),

        object: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
            .optional()
            .label('Referer Object'),
    })
        .optional()
        .label('Animal Details'),
}).label('Avatar validation schema')
