import { AsyncDatabase } from 'promised-sqlite3'

export class DB {
  static #db: any

  static async close () {
    if (this.#db !== undefined) {
      this.#db.close()
      this.#db = undefined
    }
  }

  // Forma Asyncrona
  static async open () {
    if (this.#db === undefined) {
      this.#db = await AsyncDatabase.open(process.env.SQLITEPATHDB as string)
      this.#db.inner.on('trace', (sql:string) => console.log('[TRAZADO]', sql))
    }
    return this.#db
  }
}
