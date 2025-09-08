import { createClient } from '@libsql/client'

export const DBTurso = createClient({
  url: 'libsql://integral-desarrolloinbox.aws-us-east-1.turso.io',
  authToken: process.env.tokenSQLite ?? ''
})

// export default DB

// const result = await connection.execute({
//     sql: "SELECT * FROM tblusuarios ",
//     args: [],
//   })
// console.log(result)
