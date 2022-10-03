const express           = require( "express" );
const bodyParser        = require( "body-parser" );
const MongoClient       = require( "mongodb" ).MongoClient;
const MethodOverride    = require( "method-override" );
const passport          = require( "passport" );
const localStrategy     = require( "passport-local" ).Strategy;
const session           = require( "express-session" );

const mainDir           = `${ __dirname }/views`;
const app               = express();

/**
 * 미들웨어 : Request - Response 중간에 실행되는 코드
 */
require( "dotenv" ).config();
app.use( "./views/component", express.static( "component" ) )
app.use( bodyParser.urlencoded( { extended : true } ) );
app.use( MethodOverride( "_method" ) );
app.set( "view engine", "ejs" );
app.use( session( { secret : "secretCode", resave : true, saveUninitialized : false } ) );
app.use( passport.initialize() );
app.use( passport.session() );

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

app.post( "/add", ( req, res ) => {
    db.collection( "counter" ).findOne( { name : "totalCount" }, ( err, findRes ) => {
        const totalPostCount = findRes.totalCount + 1;
        const saveData = {
            _id : totalPostCount,
            subject : req.body.subject,
            content : req.body.content
        }

        db.collection( "post" ).insertOne( saveData, ( err ) => {
            if( err ) console.log(err);
            /**
             * $set : 값을 변경할 때
             * $inc : 기존에 입력된 값에 더할 때 (auto increasement와 비슷한듯)
             */
            db.collection( "counter" ).updateOne( { name : "totalCount" }, { $inc : { totalCount : 1 } }, ( err ) => {
                if( err ) console.log(err);
                res.render( `${ mainDir }/index.ejs` );
            } );
        } );

    } );
} );

app.get( "/write", ( req, res ) => {
    res.render( `${ mainDir }/write.ejs` );
} )

app.get( "/list", ( req, res ) => {
    db.collection( "post" ).find().toArray( ( err, result ) => {
        res.render( "list.ejs", { results : result } );
    } );
} );

app.delete( "/delete", ( req, res ) => {
    db.collection( "post" ).deleteOne( { _id : parseInt( req.body._id ) }, ( err ) => {
        if( err ) console.log( err );
        // 2XX : 서버 응답 성공 코드 / 4XX : 서버 응답 실패 코드
        res.status( 200 ).send( { msg : "삭제 성공" } );
    } );
} );

app.get( "/detail/:id", ( req, res ) => {
    db.collection( "post" ).findOne( { _id : parseInt( req.params.id ) }, ( err, searchRes ) => {
        res.render( "detail.ejs", { searchData : searchRes } );
    } );
} );

app.put( "/edit", ( req, res ) => {
    /**
     * detail ejs에서 수정 요청을 보냈을 때 실행
     * form에 입력된 값들이 db.collection에 업데이트
     */
    db.collection( "post" ).updateOne( { _id : parseInt( req.body.postId ) }, 
                                       { $set : { subject : req.body.subject, content : req.body.content } }, ( err, updateRes ) => {
        if( err ) console.log(err);
        res.render( "detail.ejs", { searchData : req.body } );
    } );
} );
app.get( "/login", ( req, res ) => {
    res.render( `${ mainDir }/login.ejs` );
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
 * @Param passowrdField     : login.ejs의 from에 있는 비밀번호 입력 input의 name
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
            console.log("login suc");
            return done( null, loginRes );
        } else {
            console.log("pwd fail");
            return done( null, false, { message : "비밀번호를 확인해주세요." } );
        }
    } );
} ) );

/**
 * @Function serializeUser   : 세션을 저장시킴(로그인 성공시)
 * @Function deserializeUser : 마이페이지 접속시 발동 / 이 세션 데이터를 가진 사람을 db에서 find
 */
passport.serializeUser( ( user, done ) => {
    console.log(user);
    done( null, user.username );
} );

passport.deserializeUser( ( username, done ) => {
    done( null, {} );
} );