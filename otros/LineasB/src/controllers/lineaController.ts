import { NextFunction, Request, Response } from "express";
import { LineaService } from "../services/lineaService";
import { isValidObjectId } from "mongoose";

const lineaService = new LineaService();

export const getAllLineas = async (req: Request, res: Response): Promise<void> =>{
    // 200(OK): La solicitud se ha procesado correctamente.
    // 204(No Content): La solicitud se ha procesado correctamente, pero no hay contenido para devolver.
    // 404(Not Found): No se encontraron recursos que coincidan con la solicitud.
    // 500(Internal Server Error): Error en el servidor al procesar la solicitud.
    try {
        const lineas = await lineaService.getAllLineas()
        if (lineas.length === 0) {
            res.status(204).json({ message: "No hay lineas disponibles", data:[] });
            return
        }
        res.status(200).json(lineas);
    }catch (error) {
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

export const getLineaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 200(OK): La solicitud se ha procesado correctamente.
    // 204(No Content): La solicitud se ha procesado correctamente, pero no hay contenido para devolver.
    // 404(Not Found): No se encontraron recursos que coincidan con la solicitud.
    // 500(Internal Server Error): Error en el servidor al procesar la solicitud.
    const { id } = req.params;
    try {
        // if (!isValidObjectId(id)) {
        //     res.status(400).json({ message: "Invalid ID format" });       

        // }
        const linea = await lineaService.getLineaById(id);
        if (!linea) {
            res.status(404).json({ message: "Linea not found" });
            return;
        }
        res.status(200).json(linea);
    } catch (error) {
        next(error);
        // res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createLinea = async (req: Request, res: Response): Promise<void> => {
    // 201(Created): La solicitud se ha procesado correctamente y se ha creado un nuevo recurso.
    // 204(No Content): La solicitud se ha procesado correctamente, pero no hay contenido para devolver.
    // 400(Bad Request): La solicitud es inválida o carece de información necesaria.
    // 500(Internal Server Error): Error en el servidor al procesar la solicitud.
    try {
        console.log(req.body);
        
        const newLinea = await lineaService.createLinea(req.body);
        res.status(201).json(newLinea);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}

export const updateLinea = async (req: Request, res: Response): Promise<void> => {
    // 200(OK): La solicitud se ha procesado correctamente.
    // 204(No Content): La solicitud se ha procesado correctamente, pero no hay contenido para devolver.
    // 409(Conflict): La solicitud no se puede completar debido a un conflicto con el estado actual del recurso.
    // 500(Internal Server Error): Error en el servidor al procesar la solicitud.
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid ID format" });       
        }
        const updatedLinea = await lineaService.updateLinea(id, req.body);
        if (!updatedLinea) {
            res.status(404).json({ message: "Linea not found" });
            return;
        }
        res.status(200).json(updatedLinea);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteLinea = async (req: Request, res: Response): Promise<void> => {
    // 204(No Content): La solicitud se ha procesado correctamente y el recurso ha sido eliminado.
    // 404(Not Found): No se encontraron recursos que coincidan con la solicitud.
    // 500(Internal Server Error): Error en el servidor al procesar la solicitud.
    const { id } = req.params;
    try {
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "Invalid ID format" });       
        }
        await lineaService.deleteLinea(id);
        res.status(200).json({ message: "Linea deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}