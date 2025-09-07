import bcrypt from 'bcrypt'
import { DB } from '../config/sqlite/conexion_sqlite'
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
    try {
      const conexion = await DB.open()
      const resUsr = await conexion.all(
        `SELECT id, nombre, correo, estado FROM tblusuarios 
        ${(lowerCaseOrderBy === 'correo' ? 'ORDER BY correo' : (lowerCaseOrderBy === 'id' ? 'ORDER BY id' : ''))} 
      LIMIT ${(paginaNumero - 1) * registrosNumero}, ${registrosNumero}`)
      return resUsr
    } catch (e: any) {
        console.log(new Date().toString(), e, 'usuarioModel -> getAll', e.message);
        return []
    }
    finally {
        await DB.close()
    }
  }
    
  static async getById (id: string ) {
    try {
      let conexion = await DB.open()
      const resUsr = await conexion.all(
        `SELECT id, nombre, correo, estado, contrasena FROM tblusuarios WHERE id = ?;`, id)
      DB.close()
      if (resUsr.length === 0) return {}
      conexion = await DB.open()
      const resSeg = await conexion.all(
        'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?', id)
      DB.close()
      const seguridad: string[] = []
      resSeg.forEach((ele: { permiso_id: string }) => seguridad.push(ele.permiso_id))
      const resUsr2 = {
        ...resUsr[0],
        seguridad
      }
      return resUsr2
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModel -> getById', e.message)
      await DB.close()
      return {}
    }
  }
  
  static async getByCorreo ({ correo }: { correo: string }) {
    try {
      let conexion = await DB.open()
      const resUsr = await conexion.all(
        `SELECT id, nombre, correo, estado, contrasena
        FROM tblusuarios WHERE correo = ?;`,
        correo)
      DB.close()
      if (resUsr.length === 0) return {}
      conexion = await DB.open()
      const resSeg = await conexion.all(
        'SELECT * FROM tblusuarios_tblpermisos WHERE usuario_id = ?', resUsr[0].id)
        DB.close()
        const seguridad: string[] = []
        resSeg.forEach((ele: { permiso_id: string}) => seguridad.push(ele.permiso_id))
        const resUsr2 = {
          ...resUsr[0],
        seguridad
      }
      return resUsr2
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModel -> getByCorreo', e.message)
      await DB.close()
      return {}
    }
  }
  
  static async create ({ input, seguridad }: { input: Usuario, seguridad?: string[] }) {
    const { nombre, correo, contrasena, estado } = input
    try {
      const contrasenaEncriptada = await bcrypt.hash(contrasena, 10)
      const uuid = crypto.randomUUID()
      const conexion = await DB.open()
      await conexion.run(
        `INSERT INTO tblusuarios (id, nombre, correo, contrasena, estado) 
        VALUES ("${uuid}", ?, ?, ?, ?);`,
        nombre, correo, contrasenaEncriptada, estado
      )
      const misValores: string[][] = []
      if (seguridad!== undefined && seguridad.length > 0) {
        seguridad.forEach(async (ele: string) => {
          misValores.push([uuid, ele])
          await conexion.run(
            `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
            VALUES (?,?)`,
            uuid, ele
          )
        })
      }
      const objeto = {
        id: uuid, nombre, correo, contrasenaEncriptada, estado, seguridad: misValores
      }
      await DB.close()
      return objeto
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModel -> create', e.message)
      await DB.close()
      // throw `Error en creafdo con ${e.message}`
      return {}
    }
  }
  static async delete ({ id }: { id: string }) {
    try {
      const conexion = await DB.open()

      const { changes } = await conexion.run(
        'DELETE FROM tblusuarios WHERE id = ?', id)
      await DB.close()
      if (changes > 0) return true
      return false
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModel -> delete', e.message)
      await DB.close()
      return false
    }
  }

  static async update ({ id, input, agregarContrasena, seguridad }: { id:string, input: Partial<Usuario>, agregarContrasena: string, seguridad?: string[] }) {
    let usuarioModificar = await this.getById(id)
    if (Object.keys(usuarioModificar).length === 0) {
      return {}
    }
    
    usuarioModificar = { ...usuarioModificar, ...input }
    
    const { nombre, correo, contrasena, estado } = usuarioModificar
    try {
      let resultado
      let conexion = await DB.open()
      if (agregarContrasena === 'Si') {
        const contraseyaEncriptada = await bcrypt.hash(contrasena, 10)
        resultado = await conexion.run(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, contrasena = ?, estado = ? WHERE id = ?;',
          nombre, correo, contraseyaEncriptada, estado, id
        )
      } else {
        resultado = await conexion.run(
          'UPDATE tblusuarios SET nombre = ?, correo = ?, estado = ? WHERE id = ?;',
          nombre, correo, estado, id
        )
      }
      await DB.close()
      conexion = await DB.open()
      await conexion.run(
        `DELETE FROM tblusuarios_tblpermisos 
        WHERE usuario_id = ?`,
        id
      )
      if (seguridad) {
        if (seguridad.length > 0) {
          const misValores = []
          seguridad.forEach(async ele => {
            misValores.push([id, ele])
            await conexion.run(
              `INSERT INTO tblusuarios_tblpermisos (usuario_id, permiso_id) 
              VALUES (?,?)`,
              id, ele
            )
          })
        }
      }
      await DB.close()
      if (resultado.changes > 0) return { id, nombre, correo, estado }
      return {}
    } catch (e: any) {
      console.log(new Date().toString(), e, 'usuarioModel -> update', e.message)
      await DB.close()
      return {}
    }
  }
}

// // (async () => {
// //   await UsuarioModelo.getById({ id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e' }).then((result) => {
// //     console.log(result);})
// //   })()
//   // await UsuarioModelo.update({
//   //   id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e',
//   //   input: { nombre: 'NAA', contrasena: 'CAA', estado: 'EAA' },
//   //   agregarContrasena: 'No', seguridad: ['SA1', 'SA2','nueve4']}).then((result) => {
//   //     console.log('Fin')})
  
      
// // // UsuarioModelo.create({
// // //   input: { 
// // //     correo: 'doce12@a.com',
// // //     nombre: 'nombre doce',
// // //     contrasena: 'Doce12qwerty',
// // //     estado: 'Activo',
// // //     seguridad: ['docea', 'doceb', 'docec']
// // //   }})

// // // UsuarioModelo.getAll({pagina: '1', registros:'10'}).then((result) => {
// // //   console.log(result);
// // // })


  
// //       UsuarioModelo.getById({ id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e' }).then((result) => {
// //         console.log("CCCC");
        
// //         console.log(result);})
// // // UsuarioModelo.delete({ id: 'ece502d9-6ba3-48d7-9b26-c6f33e678914' }).then((result) => { log(result) });

// // // UsuarioModelo.getAll({pagina: '1', registros:'10'}).then((result) => {
// // //   console.log(result);
// // // })

// UsuarioModelo.getById({ id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e' }).then((result) => {console.log(result);})

//     UsuarioModelo.update({
//         id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e',
//         input: { nombre:    'N5', 
//         contrasena:         'C5', 
//         estado:             'E5',
//         correo:             'dos02@a.com'},
//         agregarContrasena: 'Si', 
//         seguridad: ['SC1', 'SC2',
//                     'SC3', 'SC4']}).then((result) => {
//         console.log('Fin')})

//      setTimeout(() => {
//       console.log("This message appears after 3 seconds.");
//       UsuarioModelo.getById({ id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e' }).then((result) => {console.log(result);})
//     }, 3000); // 3000 milliseconds = 3 seconds
  
// // UsuarioModelo.getAll({orderby: 'correo', pagina: '1', registros:'20'}).then((result) => { console.log(result); })


// // UsuarioModelo.create({
// //   input: { 
// //     correo: 'a1@a.com',
// //     nombre: 'nombre a1',
// //     contrasena: 'dieciseiesqwerty',
// //     estado: 'Activoa1',
// //     },
// //     seguridad: ['trecea', 'doceb', 'docec']
// //   }).then((result) => { console.log(result); })
  