const MongoClient   = require( "mongodb" ).MongoClient;
const { ObjectId }  = require( "mongodb" );

let router          = require( "express" ).Router();
let path            = require( "path" );
let ViewDir         = `${ path.dirname( module.parent.filename ) }/views`;
let db;

MongoClient.connect( process.env.DB_URL, ( err, client ) => {
    if( err ) {
        return console.log( { err } );
    }

    db = client.db( "todoapp" );
} );
  
router.post( "/register", ( req, res ) => {
    const username = req.body.username;
    const userData = {
        username : username,
        password : req.body.password,
        email    : `${ req.body.firstEmail }@${ req.body.secondEmail }`
    }
    db.collection( "member" ).findOne( { username : username }, ( joinCheckErr, joinCheckRes ) => {
        if( joinCheckRes ) {
            res.redirect( "/login" );
        }
        db.collection( "member" ).insertOne( userData, ( registerErr, registerRes ) => {
            res.redirect( "/" );
        } );
    } );
} );
 
  
// 다른곳에서 post.js를 사용하기 위해 export
module.exports = router;
  