import Joi from 'joi'

/** Validation Schema, please updated respected Model when updating following */
export const createCaseHistorySchema = Joi.object({
    description: Joi.string().required().min(2).max(360).label('description'),

    case: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('case'),

    assignedTo: Joi.string()
        .required()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('volunteer'),
})

/** Validation Schema, please updated respected Model when updating following */
export const updateCaseHistorySchema = Joi.object({
    description: Joi.string().optional().min(2).max(360).label('description'),

    case: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('case'),

    assignedTo: Joi.string()
        .optional()
        .regex(/^[0-9a-fA-F]{24}$/, 'valid mongo id')
        .label('volunteer'),
})
