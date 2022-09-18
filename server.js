const express = require( "express" );
const bodyParser = require( "body-parser" );
const app = express();

app.use( bodyParser.urlencoded( { extended : true } ) );

const MongoClient = require( "mongodb" ).MongoClient;
let db;
MongoClient.connect( 'mongodb+srv://admin:qwer1234@cluster0.t2fk11g.mongodb.net/?retryWrites=true&w=majority', ( err, client ) => {
    if( err ) {
        return console.log( { err } );
    }

    /**
     * @Param : db -> MongoDB에서 생성한 db이름인 todoapp에 연결한다.
     */
    db = client.db( "todoapp" );

    /**
     * collection
     * @Param : collection이름( 'MongoDB'에서 db생성할 때 입력한 값 )
     * 
     * insertOne 
     * @Param1 : 저장할 데이터
     * @Param2 : Callback Function
     */
    db.collection( "post" ).insertOne( { name : "madcow", age : 28 }, ( err, res ) => {
        console.log( "Save Complete" );
        console.log( "재밌다." );
    } );

    app.listen( 8080, () => {
        /**
         * Node Server 띄우는 거
         */
        console.log("DB Connect Success");
    } );
} );


app.get( "/", ( req, res ) => {
    res.sendFile( `${ __dirname }/html/index.html` );
} );

/**
 * @Param : req 
 *  => req : {
 *        body : {
 *           name : "data"
 *        }
 *     }
 *  이런 Object로 전송
 */
app.post( "/add", ( req, res ) => {
    res.send( "POST Complete" );
} );

/**
 * API : Application Programming Interface의 약자
 * 웹 개발에서의 API란?
 * 1. 웹서버와 고객간의 소통방법 : 서버랑 통신할 수 있는 방법
 * 2. 'GET', 'POST'의 첫번째 Parameter ex) '/home'
 * 
 * REST 원칙 6개
 * 1. Uniform Interface : 하나의 자료는 하나의 URL로
 * 2. Client-Server 역할구분 -> 브라우저는 요청 서버는 응답
 * 3. Stateless -> 요청 1과 요청 2는 의존성이 없어야함.
 * 4. Cacheable -> 서버에서 보내주는 정보들은 캐싱이 가능해야함 -> chrome에서 대부분 해주기 때문에 중요하진 않음
 * 5. Layerd System
 * 6. Code on Demand
 * 
 * REST의 좋은예
 * www.example.com/products/66432
 * instagram.com/explore/tags/kpop/
 * facebook.com/natgeo/photos/
 */