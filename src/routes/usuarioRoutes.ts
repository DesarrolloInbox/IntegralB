import { Router } from "express";
// import { getAllLineas, getLineaById, createLinea, updateLinea, deleteLinea } from "../controllers/lineaController";
import { obtenerTodo, obtenerPorId, crear, actualizar, eliminar } from '../controllers/usuarioController'

const router = Router();

router.get('/', obtenerTodo);
router.get('/:id', obtenerPorId);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;