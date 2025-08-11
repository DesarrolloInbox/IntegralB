import { createClient } from "@libsql/client"
import varDotEnv from 'dotenv'

varDotEnv.config({path: './.env'});

const connection = createClient({
    url: "libsql://general-desarrolloinbox.turso.io",
    authToken: process.env.tokenSQLite
})

export default connection

// const result = await connection.execute({
//     sql: "SELECT * FROM tblusuarios ",
//     args: [],
//   });
// console.log(result);