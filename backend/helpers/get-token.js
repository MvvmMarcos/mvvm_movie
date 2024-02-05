/**
 * Função que retorna o token do usuario pela requisição
 * @param {token} req 
 * @returns 
 */
const getToken = (req)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    return token;
}
module.exports = getToken;