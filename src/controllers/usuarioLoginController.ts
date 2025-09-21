import { DBTurso } from '../config/turso/conexion_sqliteTurso'
import { Request, Response } from "express"
import { validatePartialUsuario } from '../esquemas/usuarioValidate'
import { UsuarioModelo } from "../models/usuarioModelTurso";
import { esObjetoVacio } from '../utils/esObjetoVacio'
import bcrypt from 'bcrypt'
import jwt from'jsonwebtoken';
import { Usuario } from '../types/usuario';

export const accesar = async (req: Request, res: Response) => {
    try{
        const result = validatePartialUsuario(req.body)
        if (!result.success) {
            let tmp = JSON.parse(result.error.message)
            return res.status(200).json({ estado: 0, payload: {}, msg: tmp[0].message })
        }
        let {correo, contrasena} = req.body;
        if (correo === undefined || contrasena === undefined) return res.status(200).json({ estado: 0, payload: {}, msg: "No se proporciono Usuario/Contraseña"})
        const objeto = await UsuarioModelo.getByCorreo({ correo }) as Usuario;
        if (esObjetoVacio(objeto)) return res.status(200).json({ estado: 0, msg: 'No existe el usuario', payload: {} })
        if ('estado' in objeto && objeto.estado === 'Inactivo') return res.status(200).json({ estado: 0, payload: {}, msg: 'Usuario Inactivo'})
        const usuario = objeto;
        const matchPassword = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!matchPassword){
            return res.status(200).json({ estado: 0, payload: {}, msg: 'Contraseña Invalida'});
        }else{
            const secreto = process.env.SECRETO;
            if (!secreto) {
                return res.status(500).json({ estado: 0, payload: {}, msg: 'Falta la variable de entorno SECRETO' });
            }
            let token = jwt.sign({
                nombre: objeto.nombre,
                correo: objeto.correo,
                seguridad: objeto.seguridad,
            },
                secreto, {expiresIn: 600}
            )
            res.status(200).json({ estado: 1, payload: {
                    token, 
                    id: objeto.id,
                    nombre: objeto.nombre,
                    correo: objeto.correo,
                    seguridad: objeto.seguridad}, msg: null });
        }
    } catch (error) {
        res.status(500).json({ estado:-1, payload: null, msg: "Internal Server Error" });
    }
}

export const validaToken = async (req: Request, res: Response) => {
    let { token } = req.body
    try{
        const secreto = process.env.SECRETO;
        if (!secreto) {
            return res.status(500).json({ estado: 0, error: 'Falta la variable de entorno SECRETO', msg: null });
        }
        let decoded = jwt.verify(token, secreto);
        res.json({ estado: 1, payload: decoded, error: null, msg: null });
    }catch(e){
        res.status(200).json({ estado: 0, error: 'Token invalido'})
    }
}