const mongoose = require('../db/conn');
const {Schema} = mongoose;

const Movie = mongoose.model('Movie', new Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        images:{
            type:Array,
            required:true
        },
        trailer:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        length:{
            type:String,
            required:true
        },
        average:{
            type:Number
        },
        user:Object,
        comments:Array
    },
    {timestamps:true}
))
module.exports = Movie;