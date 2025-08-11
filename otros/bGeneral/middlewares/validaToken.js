import jwt from 'jsonwebtoken'

export let revisaToken = async (req, res, next) => {
    if (req.url === '/api/login'){
        next();
    }else{
        let token = req.headers.authorization;
        if (!token){
            return res.json({ estado:0, payload: null, error: 'Falta información de autorización', msg: 'Falta el encabezado authorization' })
        }
        let soloToken = req.headers.authorization.split(" ")[1]
        if (!soloToken){
            return res.json({ estado:0, payload: null, error: 'Falta información de autorización', msg: 'Falta el dato Bearer Token' })
        }
        try{
            let decoded = jwt.verify(soloToken, process.env.SECRETO)
            next();
        }catch(e){
            return res.status(404).json({ estado: 0, payload: null, error: 'Token invalido', msg: e.message })
        }
        
    }
}