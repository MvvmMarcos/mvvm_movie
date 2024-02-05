const express = require('express');
const cors = require('cors');
const app = express();
//Configuração do JSON response
app.use(express.json());
//solve cors O CORS permite definir configurações para que aplicativos de um domínio (origem) possam acessar recursos de um domínio diferente.
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
//public folder para as imagens
app.use(express.static('public'));

//rotas;
const UserRoutes = require('./routes/UserRoutes');
const MovieRoutes = require('./routes/MovieRoutes');
app.use('/users', UserRoutes);
app.use('/movies', MovieRoutes);
app.listen(5000);