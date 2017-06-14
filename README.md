# Thingstar UI 개발환경
Thingstar UI 개발환경 구축 
## 사전 조건
* Git
* node `^5.0.0`
* yarn `^0.23.0` or npm `^3.0.0`


## 설치
```
  $ git clone https://github.com/nunoblue/ts-react
  $ yarn (or 'npm install')
```

## 프로젝트 실행
설치가 끝난 후 아래 명령으로 간단하게 실행 테스트가 가능합니다.
```
  $ yarn start   // 개발용 서버 기동(or 'npm start') 
```

더 자세한 스크립트는 아래 표를 참조하시면 됩니다.

|`yarn <script>`    |Description|
|-------------------|-----------|
|`start`            |개발 모드 서버 기동 `localhost:3001`|
|`start:prod`       |운영 모드 서버 기동|
|`start:server`     |개발 모드 서버 기동(TBD)|
|`build:ui`         |운영 배포본 UI 빌드 ./public|
|`build:server`     |운영 배포본 서버 빌드(TBD)|
|`test`             |프로젝트 설정 테스트|



## 프로젝트 구조
```
.
├── less                       # Style 정의를 위한 less 파일
├── node_modules               # 설치된 Node 모듈
├── public                     # 빌드 배포본
│   ├── asset                  # 3rd-party 라이브러리
│   └── images                 # 이미지 파일
├── src                        # 소스 코드 디렉토리
│   ├── actions                # redux action 정의
│   ├── components             # 컴포넌트 소스 코드
│   ├── containers             # 컨테이너 소스 코드
│   ├── reducers               # redux reducer 소스 코드
│   ├── services               # 서비스 소스 코드
│   ├── utils                  # 유틸리티(Date, String 등) 소스 코드 
│   ├── config.js              # Application 환경설정 파일
│   ├── index.html             # Main HTML 페이지
│   └── index.js               # Application 기동 및 렌더링
├── vendors                    # 3rd-party 라이브러리 임시 저장
├── .eslintrc                  # ES Lint 설정
├── package.json               # 프로젝트 설정
├── webpack.common.config.js   # Webpack 공통 설정
├── webpack.common.dev.js      # 개발 모드 Webpack 설정
└── webpack.common.prod.js     # 운영 모드 Webpack 설정
```

### React 참조자료
- [React Redux Starter Kit](https://github.com/davezuko/react-redux-starter-kit) - React, Redux 기반 스타터 킷
- [Redux 문서](https://dobbit.github.io/redux/)

### Webpack 참조자료
- [웹팩입문자를 위한 튜토리얼 파트1 - 웹팩 입문](https://github.com/AriaFallah/WebpackTutorial/tree/master/ko-arahansa/part1)
- [웹팩입문자를 위한 튜토리얼 파트2 - 웹팩 입문](https://github.com/AriaFallah/WebpackTutorial/tree/master/ko-arahansa/part2)

#### ES6 참조자료
- [ES6 Cheetsheet](https://github.com/DrkSephy/es6-cheatsheet/blob/master/README_ko.md)
- [ES6 Exploring](http://exploringjs.com/es6/) ES6 기술문서
- [ES6 Console](https://es6console.com/) - 버전별 ECMAScript 코드 테스트 및 변환

#### React 개발 도구
- [React-Redux Devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

## 라이브러리
- [Axios](https://github.com/mzabriskie/axios) - Ajax 통신 라이브러리

## 코드 품질
- [AirBnB React StyleGuide](https://github.com/airbnb/javascript/tree/master/react)

## 향후 고려대상 라이브러리
- [Wix React Template](https://github.com/wix/react-templates)