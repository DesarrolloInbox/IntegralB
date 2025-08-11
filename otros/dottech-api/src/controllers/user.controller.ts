import { Request, Response, Router } from "express";
import { autoInjectable } from "tsyringe";
import { UserService } from "../services/user.service";

@autoInjectable()
export class UserController {
    public router = Router()

    constructor(private userService: UserService){
        this.#setRoutes()

    }

    #setRoutes() {
        this.router.route('/login').post(this.#login)
        this.router.route('/register').post(this.#register)
    }

    #login = async (req: Request, res: Response) => {
        try{
            const response = await this.userService.login(req.body)
            res.send(response)
        }catch (error) {
            res.status(400).json({ msg: 'Error username not found'})
        }
    }

    #register = async (req: Request, res: Response) => {
        try {
            this.userService.register(req.body)
            res.send({ msg: 'User registered' })
        }catch (error) {
            res.status(400).json({ msg: 'Error username already exists '})
        }
    }
}