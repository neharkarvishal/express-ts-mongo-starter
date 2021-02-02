import { NextFunction, Request, Response } from 'express'

class HomeController {
    static create() {
        return new HomeController()
    }

    index = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.sendStatus(200)
        } catch (error) {
            return next(error)
        }
    }
}

export default HomeController
