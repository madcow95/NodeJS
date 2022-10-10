const express           = require( "express" );
const bodyParser        = require( "body-parser" );
const MongoClient       = require( "mongodb" ).MongoClient;
const MethodOverride    = require( "method-override" );
const passport          = require( "passport" );
const localStrategy     = require( "passport-local" ).Strategy;
const session           = require( "express-session" );
// file upload를 위한 미들웨어
const multer            = require( "multer" );

const mainDir           = `${ __dirname }/views`;
const app               = express();

/**
 * 미들웨어 : Request - Response 중간에 실행되는 코드
 */
require( "dotenv" ).config();
app.use( "./views/component", express.static( "component" ) )
app.set( "view engine", "ejs" );
app.use( bodyParser.urlencoded( { extended : true } ) );
app.use( MethodOverride( "_method" ) );
app.use( session( { secret : "secretCode", resave : true, saveUninitialized : false } ) );
app.use( passport.initialize() );
app.use( passport.session() );

// '/'경로로 요청했을 때 이 미들웨어를 적용해주라.
app.use( "/post", require( "./routes/post.js" ) );

let db;

/**
 * 아래 이상한 긴 글자들은 db접속 문자열(환경변수 : environment variable)로 개발환경 변경이나 컴퓨터를 바꾸면 수정이 필요할 수도 있음
 * 이러한 환경 변수들을 따로 관리해야함 -> 그렇게 하기 위해 .env 파일로 관리 하는데 그러면 server.js가 유출되도 따로 관리하기 때문에
 * 보안상 이점이 약간 있음
 */
MongoClient.connect( process.env.DB_URL, ( err, client ) => {
    if( err ) {
        return console.log( { err } );
    }

    db = client.db( "todoapp" );
    app.listen( 8080 );
} );


app.get( "/", ( req, res ) => {
    res.render( `${ mainDir }/index.ejs` );
} );

app.get( "/write", ( req, res ) => {
    res.render( `${ mainDir }/write.ejs` );
} )

app.get( "/list", ( req, res ) => {
    db.collection( "post" ).find().toArray( ( err, result ) => {
        res.render( "list.ejs", { results : result } );
    } );
} );

app.get( "/detail/:id", ( req, res ) => {
    db.collection( "post" ).findOne( { _id : parseInt( req.params.id ) }, ( err, searchRes ) => {
        res.render( "detail.ejs", { searchData : searchRes } );
    } );
} );

app.get( "/login", ( req, res ) => {
    res.render( `${ mainDir }/login.ejs` );
} );

app.get( "/signUp", ( req, res ) => {
    res.render( `${ mainDir }/signup.ejs` );
} );

app.post( "/login", passport.authenticate( "local", {
    /**
     * 로그인에 실패하면 fail로 redirect
     */
    failureRedirect : "/fail"
} ) ,( req, res ) => {
    /**
     * 로그인에 성공하면 홈으로 이동
     */
    res.redirect( "/" );
} );

/**
 * passport.use : POST login의 중간 Parameter인 passport.authenticate를 통해 실행됨.
 * @Param usernameField     : login.ejs의 from에 있는 아이디 입력 input의 name
 * @Param passwordField     : login.ejs의 from에 있는 비밀번호 입력 input의 name
 * @Param session           : session 사용 유무
 * @Param passReqToCallback : 사용자가 입력한 아이디/비번 외의 정보를 가져오려면 true
 * 
 * Todo : pwd 암호화/복호화 비교
 */
passport.use( new localStrategy( {
    usernameField       : "username",
    passwordField       : "password",
    session             : true,
    passReqToCallback   : false
}, ( enterUserName, enterPassword, done ) => {
    db.collection( "member" ).findOne( { username : enterUserName }, ( err, loginRes ) => {
        if( err ) return done( err );
        if( !loginRes ) return done( null, false, { message : "존재하지 않는 아이디 입니다." } );
        if( enterPassword == loginRes.password ) {
            return done( null, loginRes );
        } else {
            return done( null, false, { message : "비밀번호를 확인해주세요." } );
        }
    } );
} ) );

/**
 * 미들웨어 사용법
 * mypage경로로 접속 했을 때 loginCheck를 실행시킴
 */
app.get( "/mypage", loginCheck, ( req , res ) => {
    res.render( "mypage.ejs", { user : req.user } );
} );

/**
 * 미들웨어에서는 arrow function이 안먹는다
 * 왜일까?
 */
function loginCheck( req, res, next ) {
    if( req.user ) {
        next();
    } else {
        res.send( "Not Login Yet" );
    }
}

/**
 * @Function serializeUser   : 세션을 저장시킴(로그인 성공시)
 * @Function deserializeUser : 마이페이지 접속시 발동 / 이 세션 데이터를 가진 사람을 db에서 find
 */
passport.serializeUser( ( user, done ) => {
    done( null, user.username );
} );

/**
 * db collection이름을 항상 유의하자
 */
passport.deserializeUser( ( username, done ) => {
    db.collection( "member" ).findOne( { username : username }, ( err, res ) => {
        done( null, res );
    } );
} );

app.post( "/register", ( req, res ) => {
    const username = req.body.username;
    const userData = {
        username : username,
        password : req.body.password
    }
    db.collection( "member" ).findOne( { username : username }, ( joinCheckErr, joinCheckRes ) => {
        if( joinCheckRes ) {
            res.redirect( "/login" );
            return;
        }
        db.collection( "member" ).insertOne( userData, ( registerErr, registerRes ) => {
            res.redirect( "/" );
        } );
    } )
} );

app.get( "/upload", ( req, res ) => {
    res.render( "upload.ejs" );
} );

const storage           = multer.diskStorage( {
    destination : ( req, file, cb ) => {
        cb( null, "./public/image" );
    },
    filename : ( req, file, cb ) => {
        cb( null, file.originalname );
    }
    //,
    // filefilter : ( req, file, cb ) => {
    //     cb( null  )
    // }
} ); // disk에 저장, memoryStorage : memory에 저장
const FileUpload = multer( { storage : storage } );

// npm install multer libary(파일을 쉽게 관리하기 위함)이용해서 file upload
// single의 Param : input의 name
// array('name', num)
app.post( "/upload", FileUpload.single( "FileName" ), ( req, res ) => {
    res.send( "upload comp" );
} );

app.get( "/image/:imageName", ( req, res ) => {
    res.sendFile( `${ __dirname }/public/image/${ req.params.imageName }` );
} )