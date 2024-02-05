const jwt = require('jsonwebtoken');

const getToken = require('./get-token');

//Middleware para validar o token do usuario;
//este ficara nas rotas privadas do sistemas;
//erro 401 -> a solicitação não foi aplicada porque não possui credenciais de autenticação válidas para o recurso de destino;
//erro 400 ->  o servidor não pode ou não irá processar a requisição devido a alguma coisa que foi entendida como um erro do cliente
const verifyToken = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({message:"Acesso negado!"})
    }
    const token = getToken(req);
    if(!token){
        return res.status(401).json({message:'Acesso negado!'});
    }
    try {
        const verified = jwt.verify(token,'nossosecret');
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({message:'Token Inválido!'})
    }
}
module.exports = verifyToken;