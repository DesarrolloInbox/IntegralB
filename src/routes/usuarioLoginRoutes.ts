import { Router } from "express";
// import { getAllLineas, getLineaById, createLinea, updateLinea, deleteLinea } from "../controllers/lineaController";
import { accesar, validaToken } from '../controllers/usuarioLoginController'

const routerUsuarioLogin = Router();

routerUsuarioLogin.post('/', accesar);
routerUsuarioLogin.post('/valida', validaToken)

export default routerUsuarioLogin;