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

app.get( "/search", ( req, res ) => {
    const searchStr = req.query.value;
    /**
     * 그냥 find로 찾는건 하나하나 검색하기 때문에 오래걸림 -> indexing이용해서 검색 => 업다운 게임같이 검색을 해서 빠르게 찾을 수 있음(대신 sort가 잘 되어있어야됨).
     * indexing search -> 빠른 검색, or 조건으로 검색, -검색어 : 해당 단어 제외 검색, "검색어" : 정확히 일치하는 단어만 검색
     */

    // find로 indexing 없이 검색
    // db.collection( "post" ).find( { subject : searchStr } ).toArray( ( err, searchRes ) => {
    //     res.render( "list.ejs", { results : searchRes } );
    // } );

    // find 함수 내에서 indexing을 통한 검색 => 여러 문제로 인해 custom searchIndex로 수정
    // db.collection( "post" ).find( { $text : { $search : searchStr } } ).toArray( ( err, searchRes ) => {
    //     console.log(searchRes);
    //     res.render( "list.ejs", { results : searchRes } );
    // } );
    // dataPipeLine
    /**
     * $sort : { _id : 1 } 1 : 오름차순, -1 : 내림차순
     * $limit : 10 // 가져올 갯수 제한
     * $project : { subject : 1, _id : 1, score : { $meta : "searchScore" } }
     * 1 : 가져옴, 0 : 안가져옴, score : 내가 따로 지정 안해줘도 알아서 점수? 같은걸 매겨주나봄 -> 높은 순으로 가져옴
     */
    const searchCriteria = [
        {
            $search : {
                index : "subjectSearch",
                text  : {
                    query : searchStr,
                    path  : "subject" // 제목, 내용 둘 다 찾고 싶으면 [ 'subject', 'content' ]
                }
            }
        }
    ];
    db.collection( "post" ).aggregate( searchCriteria ).toArray( ( err, searchRes ) => {
        console.log(searchRes);
        res.render( "list.ejs", { results : searchRes } );
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
    console.log("fx login check",req.user);
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