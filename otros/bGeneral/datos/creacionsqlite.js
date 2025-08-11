import { createClient } from "@libsql/client";

const sqlitestmt = createClient({
    url: "libsql://general-desarrolloinbox.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3MDk0MjQwMDMsImlhdCI6MTcwODgyNjc5MiwiaWQiOiI0ZjdjYzIzOS1jZWM2LTExZWUtOGYxYi02ZTk3NDE2MmViOGQifQ.aWSur0rZzm7jlzHjjtEpY8FUvj1nq97_ATVAbfz2gCxo6mCmK4jj0WW93hAbFfqy4yJ97RRoiUEKh7Idzi6iAA"
})


// try{
//     await sqlitestmt.execute({
//       sql: "INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)",
//       args: ["UsuarioW", "Usuarios - Ver/Modificar el detalle de un usuario"]
//     });
//   }catch(e){
//     // console.log(e);
//     if (e.code === "SQL_PARSE_ERROR"){
//       console.log("Cadena SQL - Error de syntaxis");
//     }else if (e.code === "SQLITE_CONSTRAINT"){
//       console.log("Ya existe el registro");
//     } else {
//       console.log("Hubo error ", e.message);
//     }
//   }
  
  
  // // -- Crear la tabla permisos
//   await sqlitestmt.execute("DROP TABLE IF EXISTS tblpermisos");
  // await sqlitestmt.execute(`
  //   CREATE TABLE IF NOT EXISTS tblpermisos (
  //       permiso TEXT NOT NULL UNIQUE,
  //       descripcion TEXT NOT NULL
  //   )`);
  // // -- Insertar permisos
  // await sqlitestmt.execute({
  //   sql: "INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)",
  //   args: ["UsuarioL", "Usuarios - Solo ver lista de usuarios"]
  // });
  // await sqlitestmt.execute({
  //   sql: "INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)",
  //   args: ["UsuarioR", "Usuarios - Ver el detalle de un usuario"]
  // });
  // await sqlitestmt.execute({
  //   sql: "INSERT INTO tblpermisos (permiso, descripcion) VALUES (?, ?)",
  //   args: ["UsuarioW", "Usuarios - Ver/Modificar el detalle de un usuario"]
  // });
  // -- Consultar permisos
  // let result = await sqlitestmt.execute(`SELECT *, rowid FROM tblpermisos LIMIT 2 OFFSET 0`);
  // console.log(result);
  // result = await sqlitestmt.execute(`SELECT *, rowid FROM tblpermisos LIMIT 2 OFFSET 2`);
  // console.log(result);
  
//   // -- Crear la tabla seguridad
// await sqlitestmt.execute("DELETE FROM tblseguridad");
// await sqlitestmt.execute("DROP TABLE IF EXISTS tblseguridad");
//   await sqlitestmt.execute(`
//     CREATE TABLE IF NOT EXISTS tblseguridad (
//         seguridad TEXT NOT NULL,
//         tblpermisos_permiso TEXT NOT NULL,
//         FOREIGN KEY (tblpermisos_permiso) REFERENCES tblpermisos (permiso)
//     )`);
//   // -- Insertar permisos
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblseguridad (seguridad, tblpermisos_permiso) VALUES (?, ?)",
//     args: ["UsuarioLectura", "UsuarioL"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblseguridad (seguridad, tblpermisos_permiso) VALUES (?, ?)",
//     args: ["UsuarioLecturaEscritura", "UsuarioL"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblseguridad (seguridad, tblpermisos_permiso) VALUES (?, ?)",
//     args: ["UsuarioLecturaEscritura", "UsuarioL"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblseguridad (seguridad, tblpermisos_permiso) VALUES (?, ?)",
//     args: ["Administrador", "UsuarioL"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblseguridad (seguridad, tblpermisos_permiso) VALUES (?, ?)",
//     args: ["Administrador", "UsuarioR"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblseguridad (seguridad, tblpermisos_permiso) VALUES (?, ?)",
//     args: ["Administrador", "UsuarioW"]
//   });
  
//   // -- Crear la tabla usuarios
// await sqlitestmt.execute("DROP TABLE IF EXISTS tblusuarios");
//   await sqlitestmt.execute(
//       `CREATE TABLE IF NOT EXISTS tblusuarios  
//           (nombre TEXT NOT NULL,
//           correo TEXT NOT NULL UNIQUE,
//           contrasena TEXT NOT NULL,
//           estado TEXT NOT NULL default 'Activo',
//           seguridad TEXT NOT NULL DEFAULT "00000000000000000000")`);
  
// //Insertar valores en usuarios
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblusuarios (nombre, correo, contrasena, seguridad) VALUES (?, ?, ?, ?)",
//     args: ["admin", "admin@a", "admin", "11111111111111111111"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblusuarios (nombre, correo, contrasena) VALUES (?, ?, ?)",
//     args: ["usr1", "usr1@a", "usr1"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblusuarios (nombre, correo, contrasena, seguridad) VALUES (?, ?, ?, ?)",
//     args: ["usr2", "usr2@a", "usr2", "01010101010101010101"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblusuarios (nombre, correo, contrasena, estado, seguridad) VALUES (?, ?, ?, ?, ?)",
//     args: ["usr3", "usr3@a", "usr3", "Inactivo", "01010101010101010101"]
//   });
//   await sqlitestmt.execute({
//     sql: "INSERT INTO tblusuarios (nombre, correo, contrasena, estado, seguridad) VALUES (?, ?, ?, ?, ?)",
//     args: ["usr4", "usr4@a", "usr4", "Activo", "0000011111000001111"]
//   });

    
  const result = await sqlitestmt.execute({
      sql: "SELECT rowid, * FROM tblusuarios WHERE rowid=2",
      args: [],
    });
console.log(result);