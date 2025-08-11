import { validateUsuario, validatePartialUsuario } from '../schemas/usuario.js'
import { esObjetoVacio } from '../utils/esObjetoVacio.js'
import { generaLog } from '../utils/generaLog.js'

export class UsuarioController {
    constructor({ usuarioModelo }) {
        this.usuarioModelo = usuarioModelo
    }

    getAll = async (req, res) => {
        let objeto = await this.usuarioModelo.getAll()
        res.json({ estado: 1, payload: objeto, error: null, msg: null })
    }

    getById = async (req, res) => {
        try {
            const { id } = req.params
            let objeto = await this.usuarioModelo.getById({ id })
            if (esObjetoVacio(objeto)) return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: null })
            res.json({ estado: 1, payload: objeto, error: null, msg: null })
        } catch (e) {
            generaLog(e, "controllers/usuario -> getById")
            return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: e.message })
        }
    }

    create = async (req, res) => {
        const result = validateUsuario(req.body)
        if (!result.success) {
            return res.status(400).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: JSON.parse(result.error.message) })
        }
        try {
            const objeto = await this.usuarioModelo.create({ input: result.data })
            if (esObjetoVacio(objeto)) return res.status(201).json( {estado: 0, payload: null, error: "Correo duplicado", msg: null })
            res.status(201).json( {estado: 1, payload: objeto, error: null, msg: null })
        } catch (e) {
            generaLog(e, "controllers/usuario -> create")
            res.status(400).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: e })
        }
    }

    update = async (req, res) => {
        try {
            const { id } = req.params
            if (id === undefined) return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: 'Falta indicar el id' })
            const result = validatePartialUsuario(req.body)
            if (!result.success) {
                let tmp = JSON.parse(result.error.message)
                return res.status(400).json({ estado: 0, payload: null, error: 'Falta de información o incorrecta', msg: tmp })
            }
            let objeto = await this.usuarioModelo.getById({ id })
            if (esObjetoVacio(objeto)) return res.status(404).json({ estado: 0, payload: null, error: 'No existe el usuario', msg: null })
            let agregarContrasena = 'No'
            if (req.body.contrasena) agregarContrasena = 'Si'
            let input = {
                ...objeto,
                ...req.body
            }
            let resultado = await this.usuarioModelo.update({ id, input, agregarContrasena })
            if (!(Object.keys(resultado).length === 0)) return res.status(200).json({ estado: 1, payload: resultado, error: null, msg: null });
            res.status(200).json({ estado: 0, payload: null, error: 'El Usuario no existe', msg: null });
        } catch (e) {
            generaLog(e, "controllers/usuario -> update")
            return res.status(404).json({ estado: 0, payload: null, error: errorMSg, msg: e.message })
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params
            let resultado = await this.usuarioModelo.delete({ id })
            if (resultado == true) return res.status(200).json({ estado: 1, payload: resultado, error: null, msg: null });
            res.status(200).json({ estado: 0, payload: null, error: 'El usuario no se pudo eliminar', msg: null });
        } catch (e) {
            generaLog(e, "controllers/usuario -> delete")
            return res.status(404).json({estado: 0, payload: null, error: 'El usuario no se pudo eliminar', msg: e
            })
        }
    }
}

// // console.log(await new UsuarioController({ usuarioModelo: UsuarioModelo}).getAll());
// console.log(await new UsuarioController({ usuarioModelo: UsuarioModelo }).getById(1));
