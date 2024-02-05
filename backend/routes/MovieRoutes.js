const router = require('express').Router();

const MovieController = require('../controllers/MovieController');

//middlewares
const verifyToken = require('../helpers/verify-token');
const {imageUpload} = require('../helpers/image-upload');

router.post('/create', verifyToken, imageUpload.array('images'), MovieController.create);
router.get('/', MovieController.getAll);
router.get('/category', MovieController.getMovieByCategory);
router.get('/mymovies', verifyToken, MovieController.getAllUserMovie);
router.get('/:id', MovieController.getMovieById);
router.delete('/:id', verifyToken, MovieController.removeMovieById);
router.patch('/:id', verifyToken, imageUpload.array('images'), MovieController.updateMovie);
// router.get('/ratings/:id',  MovieController.getRatings);
router.patch('/comments/:id', verifyToken, MovieController.comments);

module.exports = router