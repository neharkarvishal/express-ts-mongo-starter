export interface CaseInterface {
    animalDetails: {
        type: string
        name?: string
        color?: string
        identificationMark: string
        image?: string
    }
    description?: string
    address?: string
    phoneNumber: string
    alternatePhoneNumber?: string
    point: Record<string, any>
    area?: Record<string, any>
}
