const MongoClient   = require( "mongodb" ).MongoClient;
const crypto        = require( "crypto" );
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
    // const cryptPwd = _getCryptoPassword(req.body.password);
    // console.log(cryptPwd);
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

const _getCryptoPassword = ( pwd ) => {
    crypto.randomBytes( 64, ( err, buf ) => {
        crypto.pbkdf2( pwd, buf.toString( 'base64' ), 100000, 64, 'sha512', ( err, key ) => {
            return key.toString( 'base64' );
        } );
    } );
}

router.post( "/loginCheck", ( req, res ) => {
    const searchMember = {
        username : req.body.username,
        password : req.body.password
    }
    db.collection( "member" ).findOne( searchMember, ( searchErr, searchRes ) => {
        if( searchErr ) console.log(searchErr);
        let resultRes = undefined;
        if( searchRes ) {
            resultRes = "UserExist";
        }
        res.status( 200 ).send( resultRes );
    } );
} );
 
  
// 다른곳에서 post.js를 사용하기 위해 export
module.exports = router;
  