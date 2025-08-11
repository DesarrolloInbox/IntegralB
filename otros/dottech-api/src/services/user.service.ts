import { autoInjectable } from "tsyringe";
import { User } from "../interfaces/user.interface";
import { sign } from "jsonwebtoken";

@autoInjectable()
export class UserService {
    #users: User[] = [{ username: 'Daniel', password: '1234'}]

    login(user: User) {
        const userDB = this.#find(user)
        if (!userDB) {
            throw new Error ('User not found')
        }
        if (userDB.password !== user.password) {
            throw new Error ('Password incorrect')
        }
        return {
            msg: 'Successfully logged in',
            token: sign( { user: user.username} , 'SECRET')
        }
    }

    register(user: User) {
        if (this.#find(user)) {
            throw new Error ('User already exists')
        }
        this.#users.push(user)
        // return {
        //     msg: 'Successfully registered',
        //     token: sign({ user: user.username }, 'SECRET')
        // }
    }

    #find(user: User) {
        return this.#users.find(( {username }) => username === user.username)
    }
}