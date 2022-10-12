/**
 * npm으로 설치했던 라이브러리를 사용합니당 이라는 뜻
 */
const MongoClient   = require( "mongodb" ).MongoClient;
const multer        = require( "multer" );
const { ObjectId }  = require( "mongodb" );
const CommonUtil    = require( "../util/common.js" );

let router          = require( "express" ).Router();
let path            = require( "path" );

const ViewDir       = `${ path.dirname( module.parent.filename ) }/views`;

let db;
 
MongoClient.connect( process.env.DB_URL, ( err, client ) => {
    if( err ) {
        return console.log( { err } );
    }

    db = client.db( "todoapp" );
} );

const storage = multer.diskStorage( {
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

router.post( "/add", FileUpload.single( "FileName" ), ( req, res ) => {
    db.collection( "counter" ).findOne( { name : "totalCount" }, ( err, findRes ) => {

        const totalPostCount = findRes.totalCount + 1;
        const saveData = {
            _id : totalPostCount,
            subject : req.body.subject,
            content : req.body.content,
            username: req.user._id,
            fileName: req.file ? req.file.originalname : "default.jpg"
        }

        db.collection( "post" ).insertOne( saveData, ( err ) => {
            if( err ) console.log(err);
            /**
             * $set : 값을 변경할 때
             * $inc : 기존에 입력된 값에 더할 때 (auto increasement와 비슷한듯)
             */
            db.collection( "counter" ).updateOne( { name : "totalCount" }, { $inc : { totalCount : 1 } }, ( err ) => {
                if( err ) console.log(err);

                db.collection( "post" ).find().toArray( ( err, result ) => {
                    if( req.user ) {
                        res.render( `${ ViewDir }/list.ejs`, { user : req.user, results : result } );
                    } else {
                        res.render( `${ ViewDir }/list.ejs`, { user : null, results : result } );
                    }
                } );
            } );
        } );
    } );
} );

router.get( "/detail/:id", ( req, res ) => {
    db.collection( "post" ).findOne( { _id : parseInt( req.params.id ) }, ( err, searchRes ) => {

        if( req.user ) {
            res.render( "detail.ejs", { searchData : searchRes, user : req.user } );
        } else {
            res.render( "detail.ejs", { searchData : searchRes, user : null } );
        }
    } );
} );
 
router.put( "/edit", ( req, res ) => {
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
 
router.delete( "/delete", ( req, res ) => {
    const deleteDate = {
        _id : parseInt( req.body._id ),
        username : ObjectId( req.body.username )
    }
    db.collection( "post" ).deleteOne( deleteDate, ( err ) => {
        if( err ) console.log( err );
        res.status( 200 ).send( { msg : "삭제 성공" } );
    } );
} );
 
router.get( "/search", ( req, res ) => {
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
        res.render( "list.ejs", { results : searchRes } );
    } );
} );

router.get( "/getImage/:imageName", ( req, res ) => {
    res.sendFile( `${ path.dirname( module.parent.filename ) }/public/image/${ req.params.imageName }` );
} );
 
 // 다른곳에서 post.js를 사용하기 위해 export
module.exports = router;
 