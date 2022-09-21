const express = require( "express" );
const bodyParser = require( "body-parser" );
const app = express();
const MongoClient = require( "mongodb" ).MongoClient;

app.use( bodyParser.urlencoded( { extended : true } ) );

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

    app.listen( 8080, () => {
        /**
         * Node Server 띄우는 거
         */
    } );
} );


app.get( "/", ( req, res ) => {
    res.sendFile( `${ __dirname }/html/index.html` );
} );

app.post( "/add", ( req, res ) => {
    /**
     * @Param req : { 
     *      body : {
     *           html Tag -> input의 name : '입력 값'
     *      }
     *  }
     * 의 형태로 들어옴
     */
    const saveData = {
        subject : req.body.todo,
        dueDate : req.body.deadline
    }
    db.collection( "post" ).insertOne( saveData, ( err, res ) => {
        console.log( "Save Completely" );
    } );
} );
