export interface UserInterface {
    _id: string
    email: string
    role: string[]
    name?: string
    description?: string
    address?: string
    phoneNumber: string
    alternatePhoneNumber?: string
    point: Record<string, any>
}
