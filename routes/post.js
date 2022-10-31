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
            username: req.user.username,
            fileName: req.file ? req.file.originalname : "default.jpg",
            addDate : req.body.addDate
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
                    const userInfo = req.user;
                    res.render( `${ ViewDir }/list.ejs`, { user : userInfo, results : result } );
                } );
            } );
        } );
    } );
} );

router.post( "/addReply", ( req, res ) => {
    const replyData = {
        replyWriter : req.body.replyWriter,
        replyContent : req.body.replyContent,
        postNum : parseInt( req.body.postNum )
    }
    db.collection( "postReply" ).insertOne( replyData, ( err ) => {
        if( err ) console.log( err );
        res.status( 200 ).send( "write complete" );
        // db.collection( "post" ).findOne( { _id : req.body.postNum }, ( searchErr, searchRes ) => {
        //     db.collection( "postReply" ).find( { postNum : searchRes._id } ).toArray( ( replyErr, replyRes ) => {
        //         console.log(replyRes);
        //         if( req.user ) {
        //             res.render( "detail.ejs", { searchData : searchRes, user : req.user, replyInfo : replyRes } );
        //         } else {
        //             res.render( "detail.ejs", { searchData : searchRes, user : null, replyInfo : replyRes } );
        //         }
        //     } );
        // } );
    } );
} );

router.get( "/detail/:id", ( req, res ) => {
    db.collection( "post" ).findOne( { _id : parseInt( req.params.id ) }, ( err, searchRes ) => {
        db.collection( "postReply" ).find( { postNum : parseInt( searchRes._id ) } ).toArray( ( replyErr, replyRes ) => {
            const userInfo = req.user;
            res.render( "detail.ejs", { searchData : searchRes, user : userInfo, replyInfo : replyRes } );
        } )
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
        const userInfo = req.user;
        res.render( "detail.ejs", { searchData : req.body, user : userInfo } );
    } );
} );
 
router.delete( "/delete", ( req, res ) => {
    const deleteDate = {
        _id : parseInt( req.body._id ),
        username : req.body.username
    }
    db.collection( "post" ).deleteOne( deleteDate, ( err ) => {
        if( err ) console.log( err );
        res.status( 200 ).send( { msg : "삭제 성공" } );
    } );
} );

router.delete( "/deleteReply", ( req, res ) => {
    db.collection( "postReply" ).deleteOne( { _id : ObjectId( req.body.replyId ) }, ( err ) => {
        let statusInfo = {
            status : 200,
            msg    : "delSuc"
        };
        if( err ) {
            statusInfo.status = 400;
            statusInfo.msg    = "delFail"
        }
        res.status( statusInfo.status ).send( statusInfo.msg );
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
        if( err ) console.log(err);
        const userInfo = req.user;
        res.render( "list.ejs", { results : searchRes, user : userInfo } );
    } );
} );

router.get( "/getImage/:imageName", ( req, res ) => {
    res.sendFile( `${ path.dirname( module.parent.filename ) }/public/image/${ req.params.imageName }` );
} );

router.get( "/chatRoom/:chatInfo", ( req, res ) => {
    const userInfo = req.user;
    const chatInfoArr = req.params.chatInfo.split( "||" );
    const postId = chatInfoArr[0];
    const chatRoomInfo = {
        postid : postId
    }
    // 게시글의 unique 값인 게시글 번호를 db에 조회한다.
    db.collection( "chatRoom" ).findOne( chatRoomInfo, ( findChatErr, findChatRes ) => {
        let targetObjId = undefined;
        // 주어진 정보로 생성된 채팅방이 없을 때
        if( !findChatRes ) {
            chatRoomInfo.createDate = new Date();
            // 채팅방을 생성한다.
            db.collection( "chatRoom" ).insertOne( chatRoomInfo, ( insertChatRoomErr, insertChatRoomRes ) => {
                targetObjId = insertChatRoomRes.insertedId.toString();
                db.collection( "chatRoom" ).findOne( { _id : ObjectId( targetObjId ) }, ( chatRoomFindErr, chatRoomFindRes ) => {
                    findChatRes = chatRoomFindRes._id.toString();
                } );
            } );
        // 주어진 정보로 생성된 채팅방이 있을 때
        } else {
            // 불러온 채팅방의 ObjectID를 저장한다.
            targetObjId = findChatRes._id.toString();
        }
        // 채팅방의 ObjectID로 채팅방의 메세지들을 불러온다.
        db.collection( "chatMessages" ).find( { chatInfos : targetObjId } ).toArray( ( msgErr, msgRes ) => {
            // 로그인한 유저, 채팅방 정보, 채팅방 정보 안의 메세지들을 render시킨다.
            msgRes = [];
            res.render( "chatRoom.ejs", { user : userInfo, chatInfos : findChatRes, msgInfos : msgRes } );
        } );
    } );
} );

router.post( "/sendMsg", ( req, res ) => {
    db.collection( "chatMessages" ).insertOne( req.body, ( insertErr, insertRes ) => {
        if( insertErr ) {
            res.status( 400 ).send( "sendFail" );
            return;
        }

        res.status( 200 ).send( "sendSuccess" );
    } );
} );

// 서버 -> 유저 일방적 통신
router.get( "/chatRefresh/:postId", ( req, res ) => {
    res.writeHead( 200, {
        "Connection" : "keep-alive",
        "Content-Type" : "text/event-stream",
        "Cache-Control" : "no-cache"
    } );
    db.collection( "chatRoom" ).findOne( { postid : req.params.postId }, ( findChatErr, findChatRes ) => {
        db.collection( "chatMessages" ).find( { chatInfos : req.params.postId } ).toArray( ( msgErr, msgRes ) => {
            res.write( "event: msgRes\n" );
            res.write( `data: ${ JSON.stringify( msgRes ) }\n\n` );
        } );
    } );

    // DB Collection에 변동이 생기면 알려주는 일종의 Event Listener
    const pipeLine = [
        // collection 안의 원하는 document만 감시하고 싶다면 match 수정
        // 아래 작성한 document가 추가, 수정, 삭제가 되면 실행
        { $match: { "fullDocument.chatInfos" : req.params.postId } }
    ];
    const collection = db.collection( "chatMessages" );
    const changeStream = collection.watch( pipeLine );
    // change가 감지되면 아래가 실행
    changeStream.on( "change", ( changeRes ) => {
        res.write( "event: msgRes\n" );
        res.write( `data: ${ JSON.stringify( [ changeRes.fullDocument ] ) }\n\n` );
    } );
} );

// 다른곳에서 post.js를 사용하기 위해 export
module.exports = router;
 