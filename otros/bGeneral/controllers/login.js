"use strict"

import { validatePartialUsuario } from '../schemas/usuario.js'
import { esObjetoVacio } from '../utils/esObjetoVacio.js'
import { generaLog } from '../utils/generaLog.js'
import jwt from 'jsonwebtoken'
import varDotEnv from 'dotenv'
import bcrypt from 'bcrypt'

varDotEnv.config({path: './.env'});

export class LoginController {
    
    constructor({ usuarioModelo }){
        this.usuarioModelo = usuarioModelo
    }

    login = async (req, res) => {
        try {
            const result = validatePartialUsuario(req.body)
            if (!result.success) {
                let tmp = JSON.parse(result.error.message)
                return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida' })
            }
            let {correo, contrasena} = req.body;
            if (correo === undefined || contrasena === undefined) return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida'})
            let objeto = await this.usuarioModelo.getByCorreo({ correo })
            if (esObjetoVacio(objeto)) return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida'})
            if (objeto.estado === 'Inactivo') return res.status(200).json({ estado: 0, error: 'Usuario Inactivo'})
            const matchPassword = await bcrypt.compare(contrasena, objeto.contrasena);
            if (!matchPassword){
                return res.status(200).json({ estado: 0, error: 'Usuario/Contraseña Invalida'});
            }else{
                let token = jwt.sign({
                    nombre: objeto.nombre,
                    correo: objeto.correo,
                    seguridad: objeto.seguridad,
                },
                    process.env.SECRETO, {expiresIn: 1200}
                )
                res.status(200).json({ estado: 1, payload: {
                    token, 
                    id: objeto.id,
                    nombre: objeto.nombre,
                    correo: objeto.correo,
                    seguridad: objeto.seguridad}});
            }
        } catch (e) {
            generaLog(e, "controllers/login -> login")
            res.status(400).json({ error: e.message })
        }
    }

    validaToken = async (req, res) => {
        let { token } = req.body
        try{
            let decoded = jwt.verify(token, process.env.SECRETO)
            res.json({ estado: 1, payload: decoded, error: null, msg: null });
        }catch(e){
            res.status(200).json({ estado: 0, error: 'Token invalido'})
        }
    }
}