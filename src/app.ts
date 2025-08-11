import { UsuarioModelo } from './models/usuarioModel';


    UsuarioModelo.getById({ id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e' }).then((result) => {console.log(result);})

    UsuarioModelo.update({
        id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e',
        input: { nombre:    'N5', 
        contrasena:         'C5', 
        estado:             'E5',
        correo:             'dos02@a.com'},
        agregarContrasena: 'Si', 
        seguridad: ['SC1', 'SC2',
                    'SC3', 'SC4']}).then((result) => {
        console.log('Fin')})

     setTimeout(() => {
      console.log("This message appears after 3 seconds.");
      UsuarioModelo.getById({ id: 'f6f4fa1c-55a6-46c8-9ec4-1d13cac6712e' }).then((result) => {console.log(result);})
    }, 3000); // 3000 milliseconds = 3 seconds
  
// UsuarioModelo.getAll({orderby: 'correo', pagina: '1', registros:'20'}).then((result) => { console.log(result); })


// UsuarioModelo.create({
//   input: { 
//     correo: 'a1@a.com',
//     nombre: 'nombre a1',
//     contrasena: 'dieciseiesqwerty',
//     estado: 'Activoa1',
//     },
//     seguridad: ['trecea', 'doceb', 'docec']
//   }).then((result) => { console.log(result); })
  