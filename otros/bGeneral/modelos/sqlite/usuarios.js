import connection from '../../datos/database-sqlite.js'
import bcrypt from 'bcrypt'
import { ECustom } from '../../utils/ErrorCustom.js'
import { generaLog } from '../../utils/generaLog.js'

export class UsuarioModelo {

    static async getAll() {
        try {
            let { rows } = await connection.execute(
                "SELECT rowid, * FROM tblusuarios"
            )
            return rows
        } catch (e) {
            generaLog(e, "modelos/sqlite/usuario -> getAll")
            return []
        }
    }

    static async getById({ id }) {
        try {
            let { rows } = await connection.execute({
                sql: `SELECT rowid, nombre, correo, contrasena, estado, seguridad FROM tblusuarios WHERE rowid = ?;`,
                args: [id]
            })
            if (rows.length === 0) return {};
            return rows[0];
        } catch (e) {
            generaLog(e, "modelos/sqlite/usuario -> getById")
            return {}
        }
    }

    static async getByCorreo({ correo }) {
        try {
            let { rows } = await connection.execute({
                sql: `SELECT rowid, nombre, correo, contrasena, estado, seguridad FROM tblusuarios WHERE correo = ?;`,
                args: [correo]
            })
            if (rows.length === 0) return {};
            return rows[0];
        } catch (e) {
            generaLog(e, "modelos/sqlite/usuario -> getByCorreo")
            return {}
        }
    }

    static async create({ input }) {
        const { nombre, correo, contrasena, seguridad, estado } = input

        try {
            let saltos = await bcrypt.genSalt(10);
            let contrasenaEncriptada = await bcrypt.hash(contrasena, saltos);

            let resultado = await connection.execute({
                sql: `INSERT INTO tblusuarios (nombre, correo, contrasena, seguridad, estado) VALUES (?, ?, ?, ?, ?);`,
                args: [nombre, correo, contrasenaEncriptada, seguridad, estado]
            })
            let objeto = {
                rowid: Number(resultado.lastInsertRowid), nombre, correo, contrasena, seguridad, estado
            }
            return objeto
        } catch (e) {
            generaLog(e, "modelos/sqlite/usuario -> create")
            return {}
        }
    }

    static async delete({ id }) {
        try {
            let resultado = await connection.execute({
                sql: `DELETE FROM tblusuarios WHERE rowid = ?;`,
                args: [id]
            })
            if (resultado.rowsAffected > 0) return true
            return false
        } catch (e) {
            generaLog(e, "modelos/sqlite/usuario -> delete")
            return {}
        }
    }

    static async update({ id, input, agregarContrasena }) {
        const { nombre, correo, contrasena, estado, seguridad } = input
        try {
            let contrasenaEncriptada = await bcrypt.hash(contrasena, 10);
            let resultado
            if (agregarContrasena === 'Si') {
                resultado = await connection.execute({
                    sql: `UPDATE tblusuarios SET nombre = ?, correo = ?, contrasena = ?, estado = ?, seguridad = ? WHERE rowid = ?;`,
                    args: [nombre, correo, contrasenaEncriptada, estado, seguridad, id]
                })
            } else {
                resultado = await connection.execute({
                    sql: `UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ?, seguridad = ? WHERE rowid = ?;`,
                    args: [nombre, correo, estado, seguridad, id]
                })
            }
            if (resultado.rowsAffected > 0) return { nombre, correo, estado, seguridad }
            return {}
        } catch (e) {
            generaLog(e, "modelos/sqlite/usuario -> delete")
            return {}
        }
    }
}

// console.log(await UsuarioModelo.update({ id: 2, input: {nombre: 'usr1', correo: 'usr1@a.com', estado: 'Activo 1', seguridad: '00000000000000000000', contrasena: 'usr10123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 4, input: {nombre: 'usr16', correo: 'usr16@a.com', estado: 'Activo', seguridad: '00011111100000000000', contrasena: 'usr160123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 6, input: {nombre: 'usr5', correo: 'usr5@a.com', estado: 'Activo', seguridad: '01010101010101010101', contrasena: 'usr50123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 7, input: {nombre: 'usr6', correo: 'usr6@a.com', estado: 'Activo', seguridad: '01010101010101010101', contrasena: 'usr60123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 8, input: {nombre: 'usr7', correo: 'usr7@a.com', estado: 'Activo', seguridad: '01010111010000010101', contrasena: 'usr70123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 10, input: {nombre: 'usr9', correo: 'usr9@a.com', estado: 'Activo', seguridad: '11010010110000010101', contrasena: 'usr90123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 11, input: {nombre: 'usr10', correo: 'usr10@a.com', estado: 'Activo', seguridad: '11010010110000010101', contrasena: 'usr100123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 12, input: {nombre: 'usr11', correo: 'usr11@a.com', estado: 'Activo', seguridad: '11000010110000010101', contrasena: 'usr110123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 13, input: {nombre: 'usr12', correo: 'usr12@a.com', estado: 'Activo', seguridad: '11000010110000010101', contrasena: 'usr120123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 14, input: {nombre: 'usr13', correo: 'usr13@a.com', estado: 'Activo', seguridad: '11000010110000010000', contrasena: 'usr130123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.update({ id: 15, input: {nombre: 'usr15', correo: 'usr15@a.com', estado: 'Activo', seguridad: '11000010110000010000', contrasena: 'usr150123456789'}, agregarContrasena: 'Si'}))
// console.log(await UsuarioModelo.create({ input: {nombre: 'usr14', correo: 'usr14@a.com', contrasena: 'usr140123456789', seguridad: '11000010110000010000', estado: "Sigu en espera"}}))
// console.log(await UsuarioModelo.delete({ id: 23 }))
// console.log("El resultado es ", await UsuarioModelo.getAll())
// console.log(await UsuarioModelo.getById({ id: 100}))
// console.log(await UsuarioModelo.getByCorreo({ correo: 'admin@a.com'}))