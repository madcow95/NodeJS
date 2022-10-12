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
