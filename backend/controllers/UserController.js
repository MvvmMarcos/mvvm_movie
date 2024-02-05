const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/*Helpers */
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController{
    //Registrar um usuario no banco de dados
    static async register(req, res){
        //receber dados do formulario
        const {name, email, password, confirmpassword} = req.body;
        //validações dos campos obrigatórios;
        //erro 422 -> erro do usuário
        if(!name){
            res.status(422).json({message:'Por favor, preencha o campo nome!'});
            return;
        }
        if(!email){
            res.status(422).json({message:'Por favor, preencha o campo e-mail!'});
            return;
        }
        if(!password){
            res.status(422).json({message:'Por favor, preencha o campo senha!'});
            return;
        }
        if(!confirmpassword){
            res.status(422).json({message:'Por favor, preencha o campo confirmação de senha!'});
            return;
        }
        if(password !== confirmpassword){
            res.status(422).json({message:'A senha e a confirmação de senha precisam ser iguais!'});
            return;
        }
        //checar se já não ha usuário cadastrado com o e-mail informado
        const userExists = await User.findOne({email:email});
        if(userExists){
            res.status(422).json({message:'O e-mail informado já está cadastrado!'});
            return;
        }
        //criar a senha do usuário criptografada;
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //criar um objeto com as informações do usuário
        const user = new User({
            name,
            email,
            password:passwordHash
        })
        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        } catch (error) {
            //erro 500 -> erro do servidor
            res.status(500).json({message:error})
        }
    }
    //efetuar o login e retornar o usuario autenticado
    static async login(req, res){
        //validações dos campos enviados
        const {email, password} = req.body;
        //erro 422 - erro do usuário
        if(!email){
            res.status(422).json({message:'Por favor, preencha o campo e-mail!'});
            return;
        }
        if(!password){
            res.status(422).json({message:'Por favor, preencha o campo senha!'});
            return;
        }
        //verificar se existe usuario com email informado
        const user = await User.findOne({email:email});
        if(!user){
            res.status(422).json({message:'Não há usuário cadastrado com este e-mail em nosso sistema!'});
            return;
        }
        //Verificar se a senha confere com a do banco de dados;
        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword){
            res.status(422).json({message:'Senha inválida!'})
            return
        }
        await createUserToken(user, req, res);
    }
    //função que pega o usuario corrente pelo token
    static async checkUser(req, res){
        let currentUser;
        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token,'nossosecret');
            currentUser = await User.findById(decoded.id);
            currentUser.password = undefined;
        }else{
            currentUser = null;
        }
        res.status(200).send(currentUser);
    }
    //função que pega o usuário pelo id;
    static async getUserById(req, res){
        const id = req.params.id;
        //recupero o usuário sem a senha dele
        const user = await User.findById(id).select('-password');
        if(!user){
            res.status(422).json({message:'Usuário não encotrado!'});
            return;
        }
        res.status(200).json({user});
    }
    //Editar um usuário
    static async editUser(req, res){
        //pego o id por paramentro;
        const id = req.params.id;
        //pego o token pela requisição
        const token = getToken(req);
        //pegar o usuário pelo token
        const user = await getUserByToken(token);
        // console.log(user)
        //pego as informações do formulario de edição
        const {name, email, bio, password, confirmpassword} = req.body;
        let image = '';
        //se vier a imagem
        if(req.file){
            user.image = req.file.filename;
        }
        //validações dos demais campos com o 422 ->erro do usuário
        if(!name){
            res.status(422).json({message:'Por favor, preencha o campo nome!'});
            return
        }
        user.name = name;
        if(!email){
            res.status(422).json({message:'Por favor, preencha o campo e-mail!'});
            return;
        }
        //verificar se o email já esta cadastrado 
        const userExists = await User.findOne({email:email});
        if(user.email !== email && userExists){
            res.status(422).json({message:'Por favor, utilize outro e-mail!'});
            return;
        }
        user.email = email;
        if(bio){
            user.bio = bio
        }
        if(password != confirmpassword){
            res.status(422).json({message:'Por favor, as senhas precisam ser iguais'})
            return;
        }else if(password === confirmpassword && password != null){
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash
        }
        try {
            await User.findOneAndUpdate(
                {_id:user._id},
                {$set:user},
                {new:true}
            )
            res.status(200).json({message:'Usuário atualizado com sucesso!'});            
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
    
}
