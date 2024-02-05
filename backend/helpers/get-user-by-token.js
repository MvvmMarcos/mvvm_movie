const jwt = require('jsonwebtoken');
const User = require('../models/User');

//função para retornar o usuario pelo token da requisição
const getUserByToken = async(token)=>{
    //erro 401 -> a solicitação não foi aplicada porque não possui credenciais de autenticação válidas para o recurso de destino;
    if(!token){
        return res.status(401).json({message:'Acesso negado!'});
    }
    const decoded = jwt.verify(token,'nossosecret');
    const userId = decoded.id;
    const user = await User.findOne({_id:userId});
    return user;
}
module.exports = getUserByToken;