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

## 22/10/02
### 1. 저번에 만들었던 로그인 기능으로 로그인 했을 때 접속 가능한 mypage만듦
### 2. 미들웨어로 로그인 했을 때 실행되는 함수를 만들었는데 다른것들은 arraw function이 안될 때를 못봤는데 미들웨어의 함수는 arrow function이 작동하지 않았고, 내가 예전에 사용했던 function()을 사용해야 정상적으로 실행이 되더라 왜그런지는 찾아봐야 할 것 같다.
