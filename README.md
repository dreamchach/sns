# sns

## 0. 설치될 라이브러리들
- connect-flash
플래쉬 메시지를 위한 미들웨어 모듈
https://www.npmjs.com/package/connect-flash

- method-override
HTML Form태그에서 원래 POST, GET 메서드만 지원하는데 DELETE, PUT울 사용할 수 있게 지원해주는 모듈
https://www.npmjs.com/package/method-override

- ejs
일반 JavaScript로 HTML 마크업을 생성할 수 있도록 해주는 라이브러리
https://ejs.co/

- passport
Node.js용 인증 미들웨어 모듈
https://www.passportjs.org/

## 1. 환경설정
- 필요한 라이브러리 설치
- express 연동
- mongoDB 연동
- 로그인 model 생성
- .env 파일 생성

## 2. 로그인 / 회원가입을 위한 화면 구현하기
- sparse 설치
- ejs 라이브러리 연동
- login / sign up 페이지 html 생성
- login / sign up 페이지 렌더링

- sparse 설치 이유 : 일반 로그인과 sns 로그인 시 혼용 사용하면 발생할 수 있는 에러를 방지하기 위해 설치

## 3. passport를 이용한 로그인 / 회원가입 기능 구현하기
- passport 연동
- cookie 세션을 이용한 token(비스무리한 것)을 삽입
- 로그인 기능 구현
- 회원가입 기능 구현
- 로그인 시 비밀번호 비교기능 구현
- error
```bash
TypeError: req.session.regenerate is not a function
    at SessionManager.logIn (/Users/kimjiyeong/Desktop/sns/node_modules/passport/lib/sessionmanager.js:28:15)
```
위와 같은 에러는 passport 6.0과 cookie-session을 같이 사용하면 나오는 에러인데, passport 이슈에서는 5.0 사용을 권장하며, 그렇지 않을 경우에는 아래와 같은 소스 코드를 추가하면 됩니다.
```javascript
app.use(cookieSession({
    // ...
}))
// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => {
            cb()
        }
    }
    next()
})
```

## 4. 인증을 위한 미들웨어 생성
- 미들웨어를 통해 'Protected Route' 혹은 'Public Route'를 생성


## 5. 로그아웃 기능 만들기
- 로그아웃 기능 생성
- 로그아웃 시 passport에 내장된 함수로 인해 쿠키에 들어간 토큰 값이 변경됨

## 6. 비밀번호를 암호화하여 데이터베이스에 저장하는 방법
- 비밀번호 암호화