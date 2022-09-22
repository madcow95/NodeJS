const express = require( "express" );
const bodyParser = require( "body-parser" );
const MongoClient = require( "mongodb" ).MongoClient;
const app = express();

app.use( "./views/component", express.static( "component" ) )
app.use( bodyParser.urlencoded( { extended : true } ) );
app.set( "view engine", "ejs" );

let db;
MongoClient.connect( 'mongodb+srv://admin:qwer1234@cluster0.t2fk11g.mongodb.net/?retryWrites=true&w=majority', ( err, client ) => {
    if( err ) {
        return console.log( { err } );
    }

    /**
     * @Param : db -> MongoDB에서 생성한 db이름인 todoapp에 연결한다.
     */
    db = client.db( "todoapp" );

    app.listen( 8080, () => {
        /**
         * Node Server 띄우는 거
         */
    } );
} );


app.get( "/", ( req, res ) => {
    res.render( `${ __dirname }/views/index.ejs` );
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

    /**
     * collection
     * @Param : collection이름( 'MongoDB'에서 db생성할 때 입력한 값 )
     * 
     * insertOne 
     * @Param1 : 저장할 데이터
     * @Param2 : Callback Function
     */
    const saveData = {
        subject : req.body.todo,
        dueDate : req.body.deadline
    }
    db.collection( "post" ).insertOne( saveData, ( err, res ) => {
        console.log( "Save Completely" );
    } );
} );

app.get( "/write", ( req, res ) => {
    res.render( `${ __dirname }/views/write.ejs` );
} )

app.get( "/list", ( req, res ) => {
    /**
     * ejs 파일은 views Dir에 저장하지 않으면 Error: Failed to lookup view 에러 뜸
     * 
     * 9/21 : DB에 저장된 post라는 collection의 모든 데이터를 가져옴
     */
    db.collection( "post" ).find().toArray( ( err, result ) => {
        res.render( "list.ejs", { results : result } );
    } );
} );