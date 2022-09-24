const express = require( "express" );
const bodyParser = require( "body-parser" );
const MongoClient = require( "mongodb" ).MongoClient;
const app = express();

app.use( "./views/component", express.static( "component" ) )
app.use( bodyParser.urlencoded( { extended : true } ) );
app.set( "view engine", "ejs" );

let db;
const mainDir = `${ __dirname }/views`;
MongoClient.connect( 'mongodb+srv://admin:qwer1234@cluster0.t2fk11g.mongodb.net/?retryWrites=true&w=majority', ( err, client ) => {
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
            subject : req.body.todo,
            dueDate : req.body.deadline
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
        // db.collection( "counter" ).updateOne( { name : "totalCount" }, { $inc : { totalCount : -1 } }, ( err ) => {
        //     if( err ) {
        //         console.log(err);
        //         return "ERROR";
        //     } else {
        //         console.log("suc");
        //         return "SUCCESS";
        //     }
            
        // } )
    } );
} );