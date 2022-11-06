const express           = require( "express" );
const bodyParser        = require( "body-parser" );
const MongoClient       = require( "mongodb" ).MongoClient;
const MethodOverride    = require( "method-override" );
const passport          = require( "passport" );
const localStrategy     = require( "passport-local" ).Strategy;
const session           = require( "express-session" );
const CommonUtil        = require( "./util/common.js" );

const mainDir           = `${ __dirname }/views`;
const app               = express();
const http              = require( "http" ).createServer( app );
const { Server }        = require( "socket.io" );
const io                = new Server( http );

// 미들웨어 : Request - Response 중간에 실행되는 코드
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
app.use( "/member", require( "./routes/member.js" ) );

let db;

MongoClient.connect( process.env.DB_URL, ( err, client ) => {
    if( err ) {
        return console.log( { err } );
    }

    db = client.db( "todoapp" );
    // app.listen -> http.listen : 서버에 socket.io 설치 완료
    http.listen( 8080 );
} );


app.get( "/", loginCheck, ( req, res ) => {
    const userInfo = req.user;
    res.render( `${ mainDir }/index.ejs`, { user : userInfo } );
} );

app.get( "/write", loginCheck, ( req, res ) => {
    const userInfo = req.user;
    res.render( `${ mainDir }/write.ejs`, { user : userInfo } );
} )

app.get( "/list", loginCheck, ( req, res ) => {
    const userInfo = req.user;
    db.collection( "post" ).find().toArray( ( err, result ) => {
        res.render( `${ mainDir }/list.ejs`, { user : userInfo, results : result } );
    } );
} );

app.get( "/login", loginCheck, ( req, res ) => {
    res.render( `${ mainDir }/login.ejs`, { user : null } );
} );

app.get( "/signUp", loginCheck, ( req, res ) => {
    res.render( `${ mainDir }/signup.ejs`, { user : null } );
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
    const userInfo = req.user;
    res.render( "mypage.ejs", { user : userInfo } );
} );

app.get( "/findUserInfo", ( req, res ) => {
    const userInfo = req.user;
    res.render( "findUserInfo.ejs", { user : userInfo } );
} );

app.get( "/chatRoom", ( req, res ) => {
    const userInfo = req.user;
    db.collection( "member" ).find().toArray().then( memberArr => {
        memberArr = memberArr.filter( member => {
            if( member.username != userInfo.username ) {
                return member;
            }
        } );
        db.collection( "chatRoom" ).find( { chatRequester : userInfo.username } ).toArray().then( chatRoomRes => {
            db.collection( "chatRoom" ).find( { chatResponser : userInfo.username } ).toArray().then( chatRoomRes2 => {
                const allChatRoom = chatRoomRes.concat( chatRoomRes2 );
                res.render( "chatRoom.ejs", { chatRooms : allChatRoom, user : userInfo, allMembers : memberArr } );
            } );
        } )
    } );
} );

// 일종의 Event Listener : Web Socket에 접속시 실행할 때
io.on( "connection", ( socket ) => {
    // msg이름으로 전송이 된다면 내부 코드 실행
    socket.on( "msg", ( data ) => {
        console.log(data);
        db.collection( "chatRoomMessages" ).insertOne( data );
        // socket에 접속한 모든 사람에게 전송해줌.
        io.emit( "broadcast", data );
        // socket.id => 현재 socket에 접속한 사람들
        // io.to(socket.id).emit("broadcast", data); => 특정한 사람에게만 전송 1:1 채팅
    } );
} );


/**
 * 미들웨어에서는 arrow function이 안먹는다
 * 왜일까?
 */
function loginCheck( req, res, next ) {
    if( req.user ) {
        next();
    } else {
        next();
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