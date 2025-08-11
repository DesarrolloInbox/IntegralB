import express, { json } from 'express'
import { createUsuarioRouter } from './routes/usuario.js'
import { createLoginRouter } from './routes/login.js'
import cors from 'cors'
import { revisaToken } from './middlewares/validaToken.js'

export const createApp = ({ usuarioModelo }) => {
  const app = express()
  app.use(json())
  app.use(cors())
  app.disable('x-powered-by')

  app.use(revisaToken)
  app.use('/api/usuarios', createUsuarioRouter({ usuarioModelo }))
  app.use('/api/login', createLoginRouter({ usuarioModelo }))

  const PORTSERVER = process.env.PORTSERVER ?? 8000

  app.listen(PORTSERVER, () => {
    console.log(`server listening on port http://localhost:${PORTSERVER}`)
  })
}