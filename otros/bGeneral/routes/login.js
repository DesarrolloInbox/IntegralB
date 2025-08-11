import { Router } from "express";
import { LoginController } from "../controllers/login.js";

export const createLoginRouter = ({ usuarioModelo }) => {
    const loginRouter = Router()

    const loginController = new LoginController({ usuarioModelo })

    loginRouter.post('/', loginController.login)
    loginRouter.post('/valida', loginController.validaToken)

    return loginRouter
}