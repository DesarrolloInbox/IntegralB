import { NextFunction, Request, Response } from "express";
import { UsuarioModelo } from "../models/usuarioModel";
import { validateUsuario, validatePartialUsuario } from '../esquemas/usuarioValidate';

export const obtenerTodo = async (req: Request, res: Response) =>{
    let { orderby, pagina, registros } = req.query as any
    try {
        const usuarios = await UsuarioModelo.getAll({orderby, pagina, registros})
        if (usuarios.length === 0) {
            // 204(No Content): La solicitud se ha procesado correctamente, pero no hay contenido para devolver.
            res.status(200).json({ message: "No hay usuarios", estado: 0, payload:[] });
            return
        }
        // 200(OK): La solicitud se ha procesado correctamente.
        res.status(200).json({ message: "OK", estado: 1, payload: usuarios });
    }catch (error) {
        res.status(500).json({ message: error, estado: -1, payload: null }); 
    }
}

export const obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as any;
    try {
        const usuario = await UsuarioModelo.getById(id);
        console.log('usuario', usuario);
        if (Object.keys(usuario).length === 0) {
            res.status(200).json({ message: "Usuario no encontrado", estado: 0, payload:{} });
            return;
        }
        res.status(200).json({ message: "OK", estado: 1, payload: usuario });
    } catch (error) {
        next(error);
        res.status(500).json({ message: error, estado: -1, payload: null }); 
    }
}

export const crear = async (req: Request, res: Response) => {
    const result = validateUsuario(req.body)
    if (!result.success) {
        return res.status(400).json({ estado: 0, payload: {},  message: JSON.parse(result.error.message) })
    }
    try {
        const newUsuario = await UsuarioModelo.create({input: result.data, seguridad: result.data.seguridad});
        if (Object.keys(newUsuario).length === 0) {
            res.status(200).json({ estado: 0, payload: {}, message: "No se pudo crear el usuario" });
            return
        }
        res.status(201).json({ estado: 1, payload: newUsuario, message: "OK" });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: error, estado: -1, payload: null });
    }
}

export const actualizar = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
        res.status(400).json({ estado: 0, payload: {}, message: "ID inválido o no proporcionado" });
        return;
    }

    const result = validatePartialUsuario(req.body)
    if (!result.success) {
        return res.status(400).json({ estado: 0, payload: {},  message: JSON.parse(result.error.message) })
    }
    try {
        const agregarContrasena = req.body.contrasena ? 'Si': 'No';
        const seguridad = req.body.seguridad ?? [];
        const updateUsuario = await UsuarioModelo.update({ id, input: req.body, agregarContrasena, seguridad });
        if (Object.keys(updateUsuario).length === 0) {
            res.status(404).json({ estado: 0, payload: {}, message: "Usuario no encontrado" });
            return;
        }
        res.status(200).json({ estado: 1, payload: updateUsuario, message: "OK" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const eliminar = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== 'string') {
        res.status(400).json({ estado: 0, payload: {}, message: "ID inválido o no proporcionado" });
        return;
    }
    try {
        let resultado = await UsuarioModelo.delete({ id })
        if (resultado == true) return res.status(200).json({ estado: 1, payload: resultado, msg: null });
        res.status(200).json({ estado: 0, payload: null, message: 'El usuario no se pudo eliminar' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
