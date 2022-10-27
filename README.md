# 에러 정리나 테스트 해본것들은 https://blog.naver.com/lobasketve 에서 

# 개발환경
<img width="485" alt="image" src="https://user-images.githubusercontent.com/78129823/190897584-d4e9f1e8-93b5-4283-94dd-9d7f28563210.png">
NodeJS : 16.17.0

# NodeJS 연습
## 22/09/18 시작
### 개발환경 설정, NodeJS와 DB연동 

## 22/09/21
### html에서 DB로 데이터 저장 및 불러옴 
![image](https://user-images.githubusercontent.com/78129823/191512462-d86c686f-12bb-413d-8228-4419f016bf16.png)
### 이렇게 저장된 데이터를 html ejs 문법 사용해서 화면에 표시
<img width="404" alt="image" src="https://user-images.githubusercontent.com/78129823/191512572-7a61fff2-b414-4199-9e3e-7c814fd6a8be.png">

## 22/09/22
### 오늘은 html파일을 ejs파일로 변환시키고, header를 따로 빼서 include할 수 있게 변경만 했다.. 어우 피곤해 주말에 진도좀 나가야지
#### 그나저나 ejs... 생각보다 쓸만할지도?

## 22/09/24
### 1. 부트스트랩으로 페이지 좀 꾸밈
### 2. 게시글 작성, 삭제기능, 게시글 번호 MongoDB 제한자 $inc 이용해서 auto increasement 만듦
### 3. 간만에 AJAX써봄 오랜만에 쓰니 어색하다.

## 22/09/26
### 1. 나중에 각 ejs에 버튼 클릭 action을 만들고 자주 쓰이는 내용들을 모듈화 해서 코드를 줄여야겠다.
### 2. method-override를 사용해서 form 태그 안의 method를 통해 PUT/DELETE를 사용 가능하게 함
### 3. 한 ejs에서 하나하나 다 쓰니까 길어져서 불편하다. 빨리 모듈화 해야겠다.

## 22/09/27
### 야근~

## 22/09/28
### 1. 로그인 페이지 및 기능 만듬
### 2. 로그인 할 때 입력한 id, pwd로 db조회해서 있으면 session에 쿠기 발행, 없으면 에러 메세지 
### 3. npm install passport passport-local express-session로 필요한 것들 다운로드

## 22/09/29 ~ 22/10/02
### 잠시 휴가..

## 22/10/03
### 1. 저번에 만들었던 로그인 기능으로 로그인 했을 때 접속 가능한 mypage만듦
### 2. 미들웨어로 로그인 했을 때 실행되는 함수를 만들었는데 다른것들은 arraw function이 안될 때를 못봤는데 미들웨어의 함수는 arrow function이 작동하지 않았고, 내가 예전에 사용했던 function()을 사용해야 정상적으로 실행이 되더라 왜그런지는 찾아봐야 할 것 같다.

## 22/10/05
### 1. header.ejs에서 로그인 했는지 안했는지에 따라서 보이는 화면이 다르게 만들긴 했는데 이게 제대로 작동을 안하는거 같아서 수정이 필요함.

## 22/10/06
### 1. 어제 만들었던거 술먹고 해서 그런지 제대로 안되서 원복시킴
### 2. 검색 기능을 만듦. 인덱싱도 알아서 만들어 주고 좋더라. 나중에 추가 기능 들어갈 때 애용해야겠다. => 검색 기능 만들면서 했던 것들은 주석으로 잘 정리되어 있으니 나중에 기억 안나면 볼것
### 3. 지금 list보여주는 method 따로, 검색 method 따로 해놨는데 하다보니 두개 한꺼번에 쓸 수 있을거 같아 통합 해서 코드나 줄어야겠다. 점점 길어지니까 불편하다.

## 22/10/08
### 1. 회원가입 기능 대충 만듦. 나중에 꾸며야되는데.. 언제 꾸미지
### 2. server.js에 있는 애들 중 게시물 관련된 것들만 일단 분리 한결 짧아지니 편안해지는것 같다.
### 3. 까지 하고 끝내려는데 심심해서 로그인, 회원가입 css

## 22/10/10
### 1. 이미지 업로드, 업로드한 이미지 
### 2. Router 정상적으로 작동안해서 제대로 작동되게 수정
### 3. 화면 로그인 여부에 따라 보이는 화면 다르게 수정
<img width="200" alt="image" src="https://user-images.githubusercontent.com/78129823/194882544-f25e54ed-0956-4255-8e94-e7cc6c0e974d.png">
<img width="200" alt="image" src="https://user-images.githubusercontent.com/78129823/194882666-1f862de5-19b4-4ce2-9e37-d32d9677e162.png">

## 22/10/11
### 1. module을 이용해서 그동안 server.js에 쌓였던 코드들을 post.js, member.js로 옮김.

## 22/10/12
### 1. 게시글 작성할 때 이미지 업로드 기능 만듦
### 2. 게시글 상세 페이지에서 업로드한 이미지 조회 가능하도록 

## 22/10/13 ~ 14
### 이틀 연속 회식 이슈..

## 22/10/15
### 1. 게시판 페이지 Card? 형식에서 Table 형식으로 수정
### 2. 오늘은 좀 기능개선? 위주로 함 예를 들면 헤더에 있던 게시글 작성 페이지를 게시판 내부로 이동, Module에 현재 시간 가져오는 함수 만들어서 게시글 작성할 때 넣어주는 식으로(자세한 내용은 블로그에)

## 22/10/16
### 1. 로그인, 회원가입 Validation 추가
### 2. 마이페이지 수정, 비밀번호 변경 

## 22/10/17
### 회식이슈..

## 22/10/18
### 야근이슈.. 로 인해 오늘은 게시글 상세화면에서 댓글 작성 UI만 추가
### 로 끝날 줄 알았지만 하다보니 금방 만들어져서 정리함
### 1. 댓글 UI 완성(좀 허접함)
### 2. 댓글 작성, 작성한 댓글 목록 조회 완료

## 22/10/20
### 1. 댓글 작성 후 reload, 댓글 작성자와 접속한 사람의 정보가 일치할 때만 삭제 버튼이 보이게 하고, AJAX를 통해 실제 삭제 후 정상적으로 처리되면 reload 완료

## 22/10/23
### 1. 아이디, 비밀번호 찾기 페이지 생성
### 2. 이메일, 전화번호로 아이디 찾기 / 이메일, 아이디로 비밀번호 찾기 기능 완료

## 22/10/24
### 1. 게시판에서 내가 작성한 게시글을 제외한 사람에게 채팅을 걸 수 있는 UI구성 => 버튼 클릭하면 게시글 uid, 채팅을 건 사람, 채팅을 받은사람, 날짜를 db에 저장(채팅 정보 저장)
### 2. 해당 게시글, 게시글 작성자와 한 번 이라도 채팅하면 채팅창 정보를 db에서 가져와 render 까지 

## 22/10/25
### 1. 오늘 맥북을 업데이트 했더니 버전 연동이 안되어 깃이 안되는 참사가 벌어졌다. 그래서 readme만 업데이트함..
### 2. 오늘은 채팅창 UI완성된거를 바탕으로 db에서 채팅방, 채팅메세지들을 불러와 화면에 뿌려주는 형식을 만듦
### 3. 오늘은 시간이 별로 없어서 아직 실제로 테스트는 못해봄

## 22/10/26
### 1. 채팅 기능 실시간으로 주고받는걸 빼고 거의 완성했다. 커밋을 못하니 답답하다.
### 2. 간략한 소스들은 https://blog.naver.com/lobasketve 에 작성했다. 블로그를 작성해놨어서 다행이네

## 22/10/27
### 1. 회식이슈..
