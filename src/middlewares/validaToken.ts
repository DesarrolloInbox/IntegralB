import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export let revisaToken = async (req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/api/v1/accesar/'){
        next();
    }else{
        let token = req.headers.authorization;
        if (!token){
            return res.json({ estado:0, payload: null, msg: 'Falta el encabezado authorization' })
        }
        let soloToken = token ? token.split(" ")[1] : undefined;
        if (!soloToken){
            return res.json({ estado:0, payload: null, msg: 'Falta el dato Bearer Token' })
        }
        try{
            const secreto = process.env.SECRETO;
            if (!secreto) {
                return res.status(500).json({ estado: 0, payload: null, error: 'Falta la variable de entorno SECRETO', msg: 'No se ha configurado el secreto del token' });
            }
            let decoded = jwt.verify(soloToken, secreto as string);
            next();
        }catch(e){
            return res.status(404).json({ estado: 0, payload: null, error: 'Token invalido', msg: (e as Error).message })
        }
        
    }
}