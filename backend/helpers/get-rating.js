const getRatings = async(movie)=>{
    let ratingArray = [];
    var sum = 0
    var  average = 0 ///media aritmética
    movie.comments.map((comment)=>{
        ratingArray.push(comment.rating);
    })
    for(var i = 0; i < ratingArray.length;i++){
        sum += ratingArray[i]; 
    }
    avg = sum / ratingArray.length;
    movie.average = (avg.toFixed(1))
    
    return average;
    // res.status(200).json({average})
}
module.exports = getRatings
