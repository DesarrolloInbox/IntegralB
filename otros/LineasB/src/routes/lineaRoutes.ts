import { Router } from "express";
import { getAllLineas, getLineaById, createLinea, updateLinea, deleteLinea } from "../controllers/lineaController";

const router = Router();

router.get('/', getAllLineas);
router.get('/:id', getLineaById);
router.post('/', createLinea);
router.put('/:id', updateLinea);
router.delete('/:id', deleteLinea);

export default router;