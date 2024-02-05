const jwt = require('jsonwebtoken');

const createUserToken = async(user, req, res)=>{
    //Criar um token com o nome e o id do usuario
    const token = jwt.sign({
        name:user.name,
        id:user._id
    },'nossosecret');
    //retorn a mensagem, o token e o id do usuário
    res.status(200).json({
        message:'Você está autenticado',
        token:token,
        userId:user._id
    })
}
module.exports = createUserToken