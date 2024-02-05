const User =  require('../models/User');
const Movie = require('../models/Movie');
const ObjectId = require('mongoose').Types.ObjectId;
//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const getRatings = require('../helpers/get-rating');
module.exports = class MovieController{
    //create a movie
    static async create(req, res){
        //pegar as informações do body pelo formulário de criação
        const {title, description, trailer, category, length} = req.body
        //images upload
        const images = req.files;
        //validações
        if(!title){
            return res.status(422).json({message:'Preencha o campo título!'})
        }
        if(!description){
            return res.status(422).json({message:'Preencha o campo descrição!'})
        }
        if(images.length === 0){
            return res.status(422).json({message:'Preencha o campo fotos!'})
        }
        if(!trailer){
            return res.status(422).json({message:'Preencha o campo trailer!'})
        }
        if(!category){
            return res.status(422).json({message:'Preencha o campo categoria!'})
        }
        if(!length){
            return res.status(422).json({message:'Preencha o campo duração do filme!'})
        }
        //pegar o token do dono(usuário) do filme
        const token  = getToken(req);
        //pegar o usuário
        const user = await getUserByToken(token);
        // console.log(user);
        //create a object Movie
        const movie = new Movie({
            title,
            description,
            trailer,
            category,
            length,
            images:[],
            user:{
                _id:user._id,
                name:user.name,
                image:user.image
            }
        })
        images.map((image)=>{
            movie.images.push(image.filename)
        })
        try {
            const newMovie = await movie.save();
            res.status(201).json({message:'Filme cadastrado com sucesso!',newMovie})
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
    //Pegar todo os filmes para a home
    static async getAll(req, res){
        let ratingArray = [];
        var sum = 0
        var  avg = 0 
        const movies = await Movie.find().sort('-createdAt');
        movies.map((movie)=>{
            // movie.comments.map((comment)=>{
            //     ratingArray.push(comment.rating);
            // })
            // for(var i = 0; i < ratingArray.length;i++){
            //     sum += ratingArray[i]; 
            // }
            // avg = sum / ratingArray.length;
            // movie.average = avg
            getRatings(movie)
        })
        res.status(200).json({movies:movies})
    }
    //pegar todo os filmes do usuário
    static async getAllUserMovie(req, res){
        //pegar o usuário pelo token
        const token = getToken(req);
        const user = await getUserByToken(token);
        const movies = await Movie.find({'user._id':user._id}).sort('-createdAt');
        try {
            res.status(200).json({movies});
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
    //pegar o filme pelo id
    static async getMovieById(req, res){
        const id = req.params.id;
        //check if id is valid
        if(!ObjectId.isValid(id)){
            return res.status(422).json({message:'ID inválido!'});
        }
        //pegar o filme pelo id
        const movie = await Movie.findOne({_id:id});
        getRatings(movie);
        if(!movie){
            return res.status(404).json({message:'Filme não encontrado!'});
        }
        res.status(200).json({movie:movie})
    }
    //remover um filme pelo id
    static async removeMovieById(req, res){
        const id = req.params.id;
        //checar se o id é válido
        if(!ObjectId.isValid(id)){
            return res.status(422).json({message:'ID inválido'})
        }
        //checar se o filme existe
        const movie = await Movie.findById(id);
        if(!movie){
            return res.status(404).json({message:'Filme não encontrado!'})
        }
        //checar se o usuário é o dono do filme
        const token = getToken(req);
        const user = await getUserByToken(token);
        if(movie.user._id.toString() !== user._id.toString()){
            return res.status(422).json({message:'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
        }
        try {
            await Movie.findByIdAndDelete(id);
            res.status(200).json({message:'Filme removido com sucesso!'})
        } catch (error) {
            return res.status(500).json({message:error})
        }
    }
    //Atualizar o filme do usuário
    static async updateMovie(req, res){
        //pegar o id do filme
        const id = req.params.id;
        //checar se o id é válido
        if(!ObjectId.isValid(id)){
            return res.status(422).json({message:'ID inválido'})
        }
        //pegar as informções do body
        const {title, description, trailer, category, length} = req.body;
        //images Upload
        const images = req.files;
        //criar um objeto vazio para depois preenche-lo nas válidações;
        const updateData = {};
        //verificar se o filme existe
        const movie = await Movie.findById(id);
        if(!movie){
            return res.status(404).json({message:'Filme não encontrado'})
        }
        //checar se o filme pertence ao usuário logado
        const token = getToken(req);
        const user = await getUserByToken(token);
        // console.log(user._id);
        // console.log(movie.user._id)
        if(movie.user._id.toString() !== user._id.toString()){
            return res.status(422).json({message:'Houve um problema em processar sua solicitação, tente novamente mais tarde!'})
        }
        //Validações
        if(!title){
            res.status(422).json({message:'Preencha o campo título!'})
            return
        }else{
            updateData.title = title;
        }
        if(!description){
            return res.status(422).json({message:'Preencha com campo descrição!'})
        }else{
            updateData.description = description;
        }
        if(!trailer){
            return res.status(422).json({message:'Preencha o campo trailer!'})
        }else{
            updateData.trailer = trailer;
        }
        if(!category){
            return res.status(422).json({message:'Preencha o campo categoria!'})
        }else{
            updateData.category = category;
        }
        if(!length){
            return res.status(422).json({message:'Preencha o campo duração do filme!'})
        }else{
            updateData.length = length;
        }
        //verificar se veio images
        if(images.length > 0){
            updateData.images = [];
            images.map((image)=>{
                updateData.images.push(image.filename)
            })
        }
        try {
            await Movie.findByIdAndUpdate(id, updateData);
            res.status(200).json({message:'Filme atualizado com sucesso!'})
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
    //Inserir comentários no filme;
    static async comments(req, res){
        //pegar o parametro id
        const id = req.params.id;
        //pegar o commentario do body
        // const {review, rating} = req.body;
        const {review, rating} = req.body;
         //checar se o id é válido
         if(!ObjectId.isValid(id)){
            return res.status(422).json({message:'ID inválido'})
        }

        //pegar o filme pelo id
        const movie = await Movie.findById(id);
        if(!movie){
            return res.status(422).json({message:'Filme não encontrado!'})
        }
        //verificar se o usuario foi quem registrou o filme;
        const token =  getToken(req);
        const user =  await getUserByToken(token);
        if(movie.user._id.equals(user.id)){
            return res.status(422).json({message:'Você não pode comentar o seu próprio filme!'});
        }
        
        if(!review){
            return res.status(422).json({message:'Preencha o campo avaliação!'})
        }
        if(!rating){
            return res.status(422).json({message:'Selecione uma nota para o filme!'})
        }
        //verificar se o usuario ja comentou o filme
        let hasComment = false
        if(movie.comments){
            movie.comments.map((comment)=>{
                if(comment._id.equals(user._id)){
                    
                    hasComment = true
                }
            })
            
        }
        if(hasComment){
            return res.status(422).json({message:'Você já comentou o filme!'})
        }
        parseInt(rating);
        movie.comments.push(
            {
                _id:user._id,
                name:user.name,
                image:user.image,
                review,
                rating:parseInt(rating)
            }
        )
        try {
            await movie.save();
            res.status(200).json({message:'Avaliação feita com sucesso!'})
        } catch (error) {
            res.status(500).json({message:'error'})
        }
        
    }
    // Pegar a média de avaliações
    static async getMovieByCategory(req,res){
        const category = req.body.category;
        // console.log(category);
        
        const movies = await Movie.find({category:category}).sort('-createdAt');
        //checar se existe filmes pela categoria
        if(!movies){
            return res.status(422).json({message:"Filmes não encontrados!"})
        }
        res.status(200).json({movies:movies})
    }
}