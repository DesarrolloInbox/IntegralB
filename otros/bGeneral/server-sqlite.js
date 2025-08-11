import { createApp } from './app.js'

import { UsuarioModelo } from './modelos/sqlite/usuarios.js'

createApp({ usuarioModelo: UsuarioModelo })