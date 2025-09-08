import bcrypt from 'bcrypt'
import { DBTurso } from '../config/turso/conexion_sqliteTurso'
import { Usuario } from '../types/usuario'

export class UsuarioModelo {
  static async getAll ({ orderby, pagina, registros }: { orderby?: string, pagina?: string, registros?: string }) {
    let lowerCaseOrderBy: string = ''
    let paginaNumero: number = 1
    let registrosNumero = process.env.REGISTROS_MOSTRAR_MAX as any
    if (orderby) {
      lowerCaseOrderBy = orderby.toLowerCase()
    }
    if (pagina) {
      paginaNumero = parseInt(pagina)
      if (!Number.isInteger(paginaNumero)) {
        paginaNumero = 1
      }
      if (paginaNumero < 1) {
        paginaNumero = 1
      }
    }
    if (registros) {
      registrosNumero = parseInt(registros)
      if (!Number.isInteger(registrosNumero)) {
        registrosNumero = process.env.REGISTROS_MOSTRAR_MAX
      }
      if ((registrosNumero < 0) || (registrosNumero > process.env.REGISTROS_MOSTRAR_MAX! as any)) {
        registrosNumero = process.env.REGISTROS_MOSTRAR_MAX
      }
    }
    const stmt = `SELECT id, nombre, correo, estado FROM tblusuarios 
      ${(lowerCaseOrderBy === 'correo' ? 'ORDER BY correo' : (lowerCaseOrderBy === 'id' ? 'ORDER BY id' : ''))} 
      LIMIT ${(paginaNumero - 1) * registrosNumero}, ${registrosNumero}`
    try {
      const { rows } = await DBTurso.execute({
        sql: `${stmt}`,
        args: []
      })
      return rows
    } catch (e: any) {
        console.log(new Date().toString(), e, 'usuarioModelTurso -> getAll', e.message);
        return []
    }
  }
    
  static async getById (id: string ): Promise<Usuario & { seguridad: string[] } | null> {
    try {
      const { rows } = await DBTurso.execute({
        sql: `SELECT id, nombre, correo, estado, contrasena
        FROM tblusuarios WHERE id = ?;`,
        args: [id]
      })
      if (rows[0] && rows[0].id !== undefined) {
        let resSeg = { rows: [] as any[] }
        if (rows[0] && rows[0].id !== undefined) {
          resSeg = await DBTurso.execute(
            'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?',
            [rows[0].id]
          )
        }
        const seguridad: string[] = []
        resSeg.rows.forEach(ele => {
          if (typeof ele.permiso_id === 'string') {
            seguridad.push(ele.permiso_id)
          }
        })
        const resUsr2: Usuario & { seguridad: string[] } = {
          ...((rows[0] as unknown) as Usuario),
          seguridad
        }
        return resUsr2
      } else {
        return null
      }
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModelTurso -> getById', e.message)
      return null
    }
  }
  
  static async getByCorreo ({ correo }: { correo: string }) {
    try {
          const { rows } = await DBTurso.execute({
            sql: `SELECT id, nombre, correo, estado, contraseya
            FROM tblusuarios WHERE correo = ?;`,
            args: [correo]
          })
          let resSeg = { rows: [] as any[] }
          if (rows[0] && rows[0].id !== undefined) {
            resSeg = await DBTurso.execute(
              'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?',
              [rows[0].id]
            )
            const seguridad: string[] = []
            resSeg.rows.forEach(ele => seguridad.push(ele.permiso_id))
            const resUsr2 = {
              ...rows[0],
              seguridad
            }
            return resUsr2
          } else {
            return {}
          }
        } catch (e: any) {
          console.log(new Date().toString(), e, 'usuarioModelTurso -> getById', e.message)
          return {}
        }
  }
  
  static async create ({ input, seguridad }: { input: Usuario, seguridad?: string[] }) {
    const { nombre, correo, contrasena, estado } = input
    try {
      const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)
      const uuid = crypto.randomUUID()
       await DBTurso.execute({
        sql: `INSERT INTO tblusuarios (id, nombre, correo, contrasena, estado) 
        VALUES ("${uuid}", ?, ?, ?, ?);`,
        args: [nombre, correo, contrasenaEncriptada, estado]
      })
      const misValores: string[][] = []
      if (seguridad!== undefined && seguridad.length > 0) {
        seguridad.forEach(async ele => {
          misValores.push([uuid, ele])
          await DBTurso.execute({
            sql: `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
            VALUES (?,?)`,
            args: [uuid, ele]
          })
        })
      }
      const objeto = {
        id: uuid, nombre, correo, contrasenaEncriptada, estado, seguridad: misValores
      }
      return objeto
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModelTurso -> create', e.message)
      return {}
    }
  }

  static async delete ({ id }: { id: string }) {
    try {
      const { rowsAffected } = await DBTurso.execute({
        sql: 'DELETE FROM tblusuarios WHERE id = ?',
        args: [id]
      })
      if (rowsAffected > 0) return true
      return false
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModelTurso -> delete', e.message)
      return false
    }
  }

  static async update ({ id, input, agregarContrasena, seguridad }: { id:string, input: Partial<Usuario>, agregarContrasena: string, seguridad?: string[] }) {
    let usuarioModificar = await this.getById(id)
    if (!usuarioModificar) {
      return {}
    }
    
    usuarioModificar = { ...usuarioModificar, ...input }
    
    const { nombre, correo, contrasena, estado } = usuarioModificar
    try {
      let resultado = 0
      if (agregarContrasena === 'Si') {
        const contraseyaEncriptada = await bcrypt.hash(contrasena, 10)
        const { rowsAffected } = await DBTurso.execute({
          sql: 'UPDATE tblusuarios SET nombre = ?, correo = ?, contrasena = ?, estado = ? WHERE id = ?;',
          args: [nombre, correo, contraseyaEncriptada, estado, id]
        })
        resultado = rowsAffected
      } else {
        const { rowsAffected } = await DBTurso.execute({
          sql: 'UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ? WHERE id = ?;',
          args: [nombre, correo, estado, id]
        })
        resultado = rowsAffected
      }
      await DBTurso.execute({
        sql: `DELETE FROM tblusuarios_tblpermisos 
        WHERE usuario_id = ?`,
        args: [id]
      })
      if (seguridad) {
        if (seguridad.length > 0) {
          const misValores = []
          seguridad.forEach(async ele => {
            misValores.push([id, ele])
            await DBTurso.execute({
              sql: `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
              VALUES (?,?)`,
              args: [id, ele]
            })
          })
        }
      }
    if (resultado > 0) return { id, nombre, correo, estado }
      return {}
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModelTurso -> update', e.message)
      return {}
    }
  }
}