/**
 * 데이터 추가, 삭제, 수정, Validation Check등 자주 쓰게될 method들을
 * 모듈화 해서 한 곳에서 관리 예정
 * 아직 export, import방법을 몰라 일단 생성만 해놓음
 * -22/09/25-
 */

let exports = {};

const PostDelete = ( uid ) => {
    $.ajax( 
        {
          method : "DELETE",
          url    : "/delete",
          data   : {
            _id : uid
          }
        }
       ).done( ( res ) => {
        console.log(res);
        location.reload();
       } ).fail( ( xhr, textStatus, errorThrown ) => {
        console.log(xhr, textStatus, errorThrown);
       } );
}

exports = {
    PostDelete
}