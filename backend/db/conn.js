const mongoose = require('mongoose');
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/mvvmmovie');
    console.log('Conectou ao mongoose')
}
main()
.catch((error)=>console.log('Erro ao conectar ao mongoose: ' + error));
module.exports = mongoose