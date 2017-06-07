# NKIA Javascript/React Style Guide
** 본 스타일 가이드는 ES2015(ES6) 기준입니다. **
*※ [Based on Airbnb JavaScript Stytle Guide](https://github.com/airbnb/javascript)*

## Javascript 목차

  1. [참조(References)](#참조references)
  1. [오브젝트(Objects)](#오브젝트objects)
  1. [배열(Arrays)](#배열arrays)
  1. [구조화대입(Destructuring)](#구조화대입destructuring)
  1. [문자열(Strings)](#문자열strings)
  1. [함수(Functions)](#함수functions)
  1. [Arrow함수(Arrow Functions)](#arrow함수arrow-functions)
  1. [Classes & Constructors](#classes--constructors)
  1. [모듈(Modules)](#모듈modules)
  1. [이터레이터와 제너레이터(Iterators and Generators)](#이터레이터와-제너레이터iterators-and-generators)
  1. [프로퍼티(Properties)](#프로퍼티properties)
  1. [변수(Variables)](#변수variables)
  1. [Hoisting](#hoisting)
  1. [조건식과 등가식(Comparison Operators & Equality)](#조건식과-등가식comparison-operators--equality)
  1. [블록(Blocks)](#블록blocks)
  1. [코멘트(Comments)](#코멘트comments)
  1. [공백(Whitespace)](#공백whitespace)
  1. [콤마(Commas)](#콤마commas)
  1. [세미콜론(Semicolons)](#세미콜론semicolons)
  1. [형변환과 강제(Type Casting & Coercion)](#형변환과-강제type-casting--coercion)
  1. [명명규칙(Naming Conventions)](#명명규칙naming-conventions)
  1. [억세서(Accessors)](#억세서accessors)
  1. [이벤트(Events)](#이벤트events)
  1. [jQuery](#jquery)

## React 목차

  1. [기본규칙](#기본규칙)
  1. [Class vs `React.createClass` vs stateless](#class-vs-reactcreateclass-vs-stateless)
  1. [명명규칙](#명명규칙)
  1. [선언](#선언)
  1. [정렬](#정렬)
  1. [따옴표](#따옴표)
  1. [띄어쓰기](#띄어쓰기)
  1. [속성](#속성)
  1. [참조](#참조)
  1. [괄호](#괄호)
  1. [태그](#태그)
  1. [메소드](#메소드)
  1. [순서](#순서)
  1. [`isMounted`](#ismounted)


## 참조(References)

  - [1.1](#1.1) <a name='1.1'></a> 모든 참조에 대해서 `const` 를 사용하고, `var` 를 사용하지 마십시오.
  > 참조를 재할당 할 수 없으므로, 버그로 이어지고 이해하기 어려운 코드가 되는것을 방지합니다.

    ```javascript
    // bad
    var a = 1;
    var b = 2;

    // good
    const a = 1;
    const b = 2;
    ```

  - [1.2](#1.2) <a name='1.2'></a> 참조를 재할당 해야한다면 `var` 대신 `let` 을 사용하십시오.
  > `var`는 함수스코프인데 비하여, `let`은 블록스코프이기 때문에 변수스코프에 대해 명확해집니다.

    ```javascript
    // bad
    var count = 1;
    if (true) {
      count += 1;
    }

    // good, use the let.
    let count = 1;
    if (true) {
      count += 1;
    }
    ```

  - [1.3](#1.3) <a name='1.3'></a> `var`와 달리 `let` 과 `const` 는 같이 블록스코프라는 것을 유념하세요.

    ```javascript
    // const and let only exist in the blocks they are defined in.
    // const 와 let 은 선언된 블록의 안에서만 존재합니다.
    {
      let a = 1;
      const b = 1;
    }
    console.log(a); // ReferenceError
    console.log(b); // ReferenceError
    ```

**[↑ 목차로 이동](#javascript-목차)**


  ## 오브젝트(Objects)

  - [2.1](#2.1) <a name='2.1'></a> 오브젝트를 작성할때는, 리터럴 구문을 사용하십시오.

    ```javascript
    // bad
    const item = new Object();

    // good
    const item = {};
    ```

  - [2.2](#2.2) <a name='2.2'></a> 코드가 브라우저상의 스크립트로 실행될때 [예약어](http://es5.github.io/#x7.6.1)를 키로 이용하지 마십시오. IE8에서 작동하지 않습니다. [More info](https://github.com/airbnb/javascript/issues/61) 하지만 ES6 모듈안이나 서버사이드에서는 이용가능합니다.

    ```javascript
    // bad
    const superman = {
      default: { clark: 'kent' },
      private: true,
    };

    // good
    const superman = {
      defaults: { clark: 'kent' },
      hidden: true,
    };
    ```

  - [2.3](#2.3) <a name='2.3'></a> 예약어 대신 알기쉬운 동의어를 사용해 주십시오.

    ```javascript
    // bad
    const superman = {
      class: 'alien',
    };

    // bad
    const superman = {
      klass: 'alien',
    };

    // good
    const superman = {
      type: 'alien',
    };
    ```

  <a name="es6-object-concise"></a>
  - [2.4](#2.4) <a name='2.4'></a> 프로퍼티의 단축구문을 이용해 주십시오.

  > 기술과 설명이 간결해집니다.

    ```javascript
    const lukeSkywalker = 'Luke Skywalker';

    // bad
    const obj = {
      lukeSkywalker: lukeSkywalker,
    };

    // good
    const obj = {
      lukeSkywalker,
    };
    ```

  - [2.5](#2.5) <a name='2.5'></a> 프로퍼티의 단축구문은 오브젝트 선언의 시작부분에 그룹화 해주십시오.

    > 어떤 프로퍼티가 단축구문을 이용하고 있는지가 알기쉽기 때문입니다.

    ```javascript
    const anakinSkywalker = 'Anakin Skywalker';
    const lukeSkywalker = 'Luke Skywalker';

    // bad
    const obj = {
      episodeOne: 1,
      twoJediWalkIntoACantina: 2,
      lukeSkywalker,
      episodeThree: 3,
      mayTheFourth: 4,
      anakinSkywalker,
    };

    // good
    const obj = {
      lukeSkywalker,
      anakinSkywalker,
      episodeOne: 1,
      twoJediWalkIntoACantina: 2,
      episodeThree: 3,
      mayTheFourth: 4,
    };
    ```

**[↑ 목차로 이동](#javascript-목차)**

## 배열(Arrays)

  - [3.1](#3.1) <a name='3.1'></a> 배열을 작성 할 때는 리터럴 구문을 사용해 주십시오.

    ```javascript
    // bad
    const items = new Array();

    // good
    const items = [];
    ```

  - [3.2](#3.2) <a name='3.2'></a> 직접 배열에 항목을 대입하지 말고, Array#push를 이용해 주십시오.

    ```javascript
    const someStack = [];

    // bad
    someStack[someStack.length] = 'abracadabra';

    // good
    someStack.push('abracadabra');
    ```

  <a name="es6-array-spreads"></a>
  - [3.3](#3.3) <a name='3.3'></a> 배열을 복사할때는 배열의 확장연산자 `...` 를 이용해 주십시오.

    ```javascript
    // bad
    const len = items.length;
    const itemsCopy = [];
    let i;

    for (i = 0; i < len; i++) {
      itemsCopy[i] = items[i];
    }

    // good
    const itemsCopy = [...items];
    ```

  - [3.4](#3.4) <a name='3.4'></a> array-like 오브젝트를 배열로 변환하는 경우는 Array#from을 이용해 주십시오.

    ```javascript
    const foo = document.querySelectorAll('.foo');
    const nodes = Array.from(foo);
    ```

**[↑ 목차로 이동](#javascript-목차)**

## 구조화대입(Destructuring)

  - [4.1](#4.1) <a name='4.1'></a> 하나의 오브젝트에서 복수의 프로퍼티를 억세스 할 때는 오브젝트 구조화대입을 이용해 주십시오.
  > 구조화대입을 이용하는 것으로 프로퍼티를 위한 임시적인 참조의 작성을 줄이며, 가독성을 향상시킵니다.

    ```javascript
    // bad
    function getFullName(user) {
      const firstName = user.firstName;
      const lastName = user.lastName;

      return `${firstName} ${lastName}`;
    }

    // good
    function getFullName(obj) {
      const { firstName, lastName } = obj;
      return `${firstName} ${lastName}`;
    }

    // best
    function getFullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    }
    ```

  - [4.2](#4.2) <a name='4.2'></a> 배열의 구조화대입을 이용해 주십시오.

    ```javascript
    const arr = [1, 2, 3, 4];

    // bad
    const first = arr[0];
    const second = arr[1];

    // good
    const [first, second] = arr;
    ```

  - [4.3](#4.3) <a name='4.3'></a> 복수의 값을 반환하는 경우는 배열의 구조화대입이 아닌 오브젝트의 구조화대입을 이용해 주십시오.
  > 호출처에 영향을 주지않고 새로운 프로퍼티를 추가하거나 순서를 변경할수 있습니다.

    ```javascript
    // bad
    function processInput(input) {
      // then a miracle occurs
      // 그리고 기적이 일어납니다.
      return [left, right, top, bottom];
    }

    // the caller needs to think about the order of return data
    // 호출처에서 반환된 데이터의 순서를 고려할 필요가 있습니다.
    const [left, __, top] = processInput(input);

    // good
    function processInput(input) {
      // then a miracle occurs
      // 그리고 기적이 일어납니다.
      return { left, right, top, bottom };
    }

    // the caller selects only the data they need
    // 호출처에서는 필요한 데이터만 선택하면 됩니다.
    const { left, right } = processInput(input);
    ```


**[↑ 목차로 이동](#javascript-목차)**

  ## 문자열(Strings)

  - [5.1](#5.1) <a name='5.1'></a> 문자열에는 홑따옴표 `''` 를 사용해 주십시오.

    ```javascript
    // bad
    const name = "Capt. Janeway";

    // good
    const name = 'Capt. Janeway';
    ```

  - [5.2](#5.2) <a name='5.2'></a> 100 문자 이상의 문자열은 문자열 연결(+)을 이용하여 여러 줄에 나뉘어 표현하세요.

  - [5.3](#5.3) <a name='5.3'></a> 주의: 문자연결을 과용하면 성능에 영향을 미칠 수 있습니다. [jsPerf](http://jsperf.com/ya-string-concat) & [Discussion](https://github.com/airbnb/javascript/issues/40).

    ```javascript
    // bad
    const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

    // bad
    const errorMessage = 'This is a super long error that was thrown because \
    of Batman. When you stop to think about how Batman had anything to do \
    with this, you would get nowhere \
    fast.';

    // good
    const errorMessage = 'This is a super long error that was thrown because ' +
      'of Batman. When you stop to think about how Batman had anything to do ' +
      'with this, you would get nowhere fast.';
    ```

  <a name="es6-template-literals"></a>
  - [5.4](#5.4) <a name='5.4'></a> 프로그램에서 문자열을 생성하는 경우는 문자열 연결이 아닌 template strings를 이용해 주십시오.
  > Template strings 는 문자열 보간기능과 적절한 줄바꿈 기능을 갖는 간결한 구문으로 가독성이 좋기 때문입니다. 또한 엔터키를 사용하여 Multi-line 표현이 가능합니다.

    ```javascript
    // bad
    function sayHi(name) {
      return 'How are you, ' + name + '?';
    }

    // bad
    function sayHi(name) {
      return ['How are you, ', name, '?'].join();
    }

    // good
    function sayHi(name) {
      return `How are you, ${name}?`;
    }
    ```
  - [5.5](#5.5) <a name='5.5'></a> 절대로 `eval()` 을 이용하지 마십시오. 이것은 많은 취약점을 만들기 때문입니다.

**[↑ 목차로 이동](#javascript-목차)**


## 함수(Functions)

  - [6.1](#6.1) <a name='6.1'></a> 함수식 보다 함수선언을 이용해 주십시오.

  > 왜? 이름이 부여된 함수선언은 콜스택에서 간단하게 확인하는 것이 가능합니다. 또한 함수선언은 함수의 본체가 hoist 되어집니다. 그에 반해 함수식은 참조만이 hoist 되어집니다.
  이 룰에 의해 함수식의 부분을 항상 [Arrow함수](#arrow함수arrow-functions)에서 이용하는것이 가능합니다.

    ```javascript
    // bad
    const foo = function () {
    };

    // good
    function foo() {
    }
    ```

  - [6.2](#6.2) <a name='6.2'></a> 함수식(Function Expression)은 다음과 같이 사용하세요.

    ```javascript
    // immediately-invoked function expression (IIFE)
    // 즉시 실행 함수식(IIFE)
    (() => {
      console.log('Welcome to the Internet. Please follow me.');
    })();
    ```

  - [6.3](#6.3) <a name='6.3'></a> 함수이외의 블록 (if나 while같은) 안에서 함수를 선언하지 마십시오. 변수에 함수를 대입하는 대신 브라우저들은 그것을 허용하지만 모두가 다르게 해석합니다.


  - [6.4](#6.4) <a name='6.4'></a> **주의:** ECMA-262 사양에서는 `block` 은 statements의 일람으로 정의되어 있지만 함수선언은 statements 가 아닙니다. [Read ECMA-262's note on this issue](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf#page=97).

    ```javascript
    // bad
    if (currentUser) {
      function test() {
        console.log('Nope.');
      }
    }

    // good
    let test;
    if (currentUser) {
      test = () => {
        console.log('Yup.');
      };
    }
    ```

  - [6.5](#6.5) <a name='6.5'></a> 절대 파라메터에 `arguments` 를 지정하지 마십시오. 이것은 함수스코프에 전해지는  `arguments` 오브젝트의 참조를 덮어써 버립니다.

    ```javascript
    // bad
    function nope(name, options, arguments) {
      // ...stuff...
    }

    // good
    function yup(name, options, args) {
      // ...stuff...
    }
    ```

  <a name="es6-rest"></a>
  - [6.6](#6.6) <a name='6.6'></a> 절대 `arguments` 를 이용하지 마십시오. 대신에 rest syntax `...` 를 이용해 주십시오.

  >`...` 을 이용하는것으로 몇개의 파라메터를 이용하고 싶은가를 확실하게 할 수 있습니다. 더해서 rest 파라메터는 `arguments` 와 같은 Array-like 오브젝트가 아닌 진짜 Array 입니다.

    ```javascript
    // bad
    function concatenateAll() {
      const args = Array.prototype.slice.call(arguments);
      return args.join('');
    }

    // good
    function concatenateAll(...args) {
      return args.join('');
    }
    ```

  <a name="es6-default-parameters"></a>
  - [6.7](#6.7) <a name='6.7'></a> 함수의 파라메터를 변이시키는 것보다 default 파라메터를 이용해 주십시오.

    ```javascript
    // really bad
    function handleThings(opts) {
      // 안돼！함수의 파라메터를 변이시키면 안됩니다.
      // 만약 opts가 falsy 하다면 바라는데로 오브젝트가 설정됩니다.
      // 하지만 미묘한 버그를 일으킬지도 모릅니다.
      opts = opts || {};
      // ...
    }

    // still bad
    function handleThings(opts) {
      if (opts === void 0) {
        opts = {};
      }
      // ...
    }

    // good
    function handleThings(opts = {}) {
      // ...
    }
    ```

  - [6.8](#6.8) <a name='6.8'></a> side effect가 있을 default 파라메터의 이용은 피해 주십시오.

  > 혼란을 야기하기 때문입니다.

  ```javascript
  var b = 1;
  // bad
  function count(a = b++) {
    console.log(a);
  }
  count();  // 1
  count();  // 2
  count(3); // 3
  count();  // 3
  ```

  - [6.9](#6.9) <a name='6.9'></a> 항상 default 파라메터는 뒤쪽에 두십시오.

    ```javascript
    // bad
    function handleThings(opts = {}, name) {
      // ...
    }

    // good
    function handleThings(name, opts = {}) {
      // ...
    }
    ```

  - [6.10](#6.10) <a name='6.10'></a> 절대 새 함수를 작성하기 위해 Function constructor를 이용하지 마십시오.

  > Why? Creating a function in this way evaluates a string similarly to eval(), which opens vulnerabilities.

  > 왜? 이 방법으로 문자열을 평가시켜 새 함수를 작성하는것은 eval() 과 같은 수준의 취약점을 일으킬 수 있습니다.

  ```javascript
  // bad
  var add = new Function('a', 'b', 'return a + b');

  // still bad
  var subtract = Function('a', 'b', 'return a - b');
  ```

**[↑ 목차로 이동](#javascript-목차)**

## Arrow함수(Arrow Functions)

  - [7.1](#7.1) <a name='7.1'></a> (무명함수를 전달하는 듯한)함수식을 이용하는 경우 arrow함수 표기를 이용해 주십시오.

  > arrow함수는 그 context의 `this` 에서 실행하는 버전의 함수를 작성합니다. 이것은 통상 기대대로 동작 하고, 보다 간결한 구문이기 때문입니다.
  > 단, 복잡한 함수에서 로직을 정의한 함수의 바깥으로 이동하고 싶을때는 사용합니다.

    ```javascript
    // bad
    [1, 2, 3].map(function (x) {
      const y = x + 1;
      return x * y;
    });

    // good
    [1, 2, 3].map((x) => {
      const y = x + 1;
      return x * y;
    });
    ```

  - [7.2](#7.2) <a name='7.2'></a> 함수의 본체가 하나의 식으로 구성된 경우에는 중괄호({})를 생략하고 암시적 return을 이용하는것이 가능합니다. 그 외에는 `return` 문을 이용해 주십시오.

  > 복수의 함수가 연결된 경우에 읽기 쉬워집니다. 단, Object를 반환할 때에는 `return`문을 사용하세요.

    ```javascript
    // good
    [1, 2, 3].map(number => `A string containing the ${number}.`);

    // bad
    [1, 2, 3].map(number => {
      const nextNumber = number + 1;
      `A string containing the ${nextNumber}.`;
    });

    // good
    [1, 2, 3].map(number => {
      const nextNumber = number + 1;
      return `A string containing the ${nextNumber}.`;
    });
    ```

  - [7.3](#7.3) <a name='7.3'></a> 식이 복수행에 걸쳐있을 경우는 가독성을 더욱 좋게하기 위해 소괄호()로 감싸 주십시오.

  > 함수의 개시와 종료부분의 가독성이 좋아집니다.

    ```js
    // bad
    [1, 2, 3].map(number => 'As time went by, the string containing the ' +
      `${number} became much longer. So we needed to break it over multiple ` +
      'lines.'
    );

    // good
    [1, 2, 3].map(number => (
      `As time went by, the string containing the ${number} became much ` +
      'longer. So we needed to break it over multiple lines.'
    ));
    ```

  - [7.4](#7.4) <a name='7.4'></a> 함수의 인수가 하나인 경우 소괄호()를 생략하는게 가능합니다.

  > Why? Less visual clutter.

  > 왜? 별로 보기 어렵지 않기 때문입니다.

    ```javascript
    // good
    [1, 2, 3].map(x => x * x);

    // good
    [1, 2, 3].reduce((y, x) => x + y);
    ```

**[↑ 목차로 이동](#목차)**


  ## Classes & Constructors

  - [8.1](#8.1) <a name='9.1'></a> `prototype` 을 직접 조작하는것을 피하고 항상 `class` 를 이용해 주십시오.

  > `class` 구문은 간결하고 의미를 알기 쉽기 때문입니다.

    ```javascript
    // bad
    function Queue(contents = []) {
      this._queue = [...contents];
    }
    Queue.prototype.pop = function() {
      const value = this._queue[0];
      this._queue.splice(0, 1);
      return value;
    }

    // good
    class Queue {
      constructor(contents = []) {
        this._queue = [...contents];
      }
      pop() {
        const value = this._queue[0];
        this._queue.splice(0, 1);
        return value;
      }
    }
    ```

  - [8.2](#8.2) <a name='8.2'></a> 상속은 `extends` 를 이용해 주십시오.

  > `instanceof` 를 파괴하지 않고 프로토타입 상속을 하기 위해 빌트인 된 방법이기 때문입니다.

    ```javascript
    // bad
    const inherits = require('inherits');
    function PeekableQueue(contents) {
      Queue.apply(this, contents);
    }
    inherits(PeekableQueue, Queue);
    PeekableQueue.prototype.peek = function() {
      return this._queue[0];
    }

    // good
    class PeekableQueue extends Queue {
      peek() {
        return this._queue[0];
      }
    }
    ```

  - [8.3](#8.3) <a name='8.3'></a> 메소드의 반환값으로 `this` 를 반환하는 것으로 메소드채이닝을 할 수 있습니다.

    ```javascript
    // bad
    Jedi.prototype.jump = function() {
      this.jumping = true;
      return true;
    };

    Jedi.prototype.setHeight = function(height) {
      this.height = height;
    };

    const luke = new Jedi();
    luke.jump(); // => true
    luke.setHeight(20); // => undefined

    // good
    class Jedi {
      jump() {
        this.jumping = true;
        return this;
      }

      setHeight(height) {
        this.height = height;
        return this;
      }
    }

    const luke = new Jedi();

    luke.jump()
      .setHeight(20);
    ```


  - [8.4](#8.4) <a name='8.4'></a> toString()을 작성할 때 올바르게 동작하는지와 side effect 가 없는지 확인해 주십시오.

    ```javascript
    class Jedi {
      constructor(options = {}) {
        this.name = options.name || 'no name';
      }

      getName() {
        return this.name;
      }

      toString() {
        return `Jedi - ${this.getName()}`;
      }
    }
    ```

**[↑ 목차로 이동](#javascript-목차)**


## 모듈(Modules)

  - [9.1](#9.1) <a name='9.1'></a> 비표준 모듈시스템이 아닌 항상 (`import`/`export`) 를 꼭 이용해 주십시오. 이렇게 함으로써 선호하는 모듈시스템에 언제라도 옮겨가는게 가능해 집니다.

    ```javascript
    // bad
    const AirbnbStyleGuide = require('./AirbnbStyleGuide');
    module.exports = AirbnbStyleGuide.es6;

    // ok
    import AirbnbStyleGuide from './AirbnbStyleGuide';
    export default AirbnbStyleGuide.es6;

    // best
    import { es6 } from './AirbnbStyleGuide';
    export default es6;
    ```

  - [9.2](#9.2) <a name='9.2'></a> wildcard import 는 사용하지 않습니다.

    ```javascript
    // bad
    import * as AirbnbStyleGuide from './AirbnbStyleGuide';

    // good
    import AirbnbStyleGuide from './AirbnbStyleGuide';
    ```

  - [9.3](#9.3) <a name='9.3'></a> import 문으로부터 직접 export 하는것은 사용하지 않습니다.

  > 한줄짜리는 간결하지만 import 와 export 방법을 명확히 한가지로 해서 일관성을 갖는 것이 가능합니다.

    ```javascript
    // bad
    // filename es6.js
    export { es6 as default } from './airbnbStyleGuide';

    // good
    // filename es6.js
    import { es6 } from './AirbnbStyleGuide';
    export default es6;
    ```

  **[↑ 목차로 이동](#목차)**

  ## 이터레이터와 제너레이터(Iterators and Generators)

  - [10.1](#10.1) <a name='10.1'></a> iterators를 이용하지 마십시오. `for-of` 루프 대신에 `map()` 과 `reduce()` 와 같은 JavaScript 고급함수(higher-order functions)를 이용해 주십시오.

  > 고급함수는 immutable(불변)룰을 적용합니다. side effect에 대해 추측하는거보다 값을 반환하는 순수 함수를 다루는게 간단하기 때문입니다.

    ```javascript
    const numbers = [1, 2, 3, 4, 5];

    // bad
    let sum = 0;
    for (let num of numbers) {
      sum += num;
    }

    sum === 15;

    // good
    let sum = 0;
    numbers.forEach((num) => sum += num);
    sum === 15;

    // best (use the functional force)
    const sum = numbers.reduce((total, num) => total + num, 0);
    sum === 15;
    ```

  - [10.2](#10.2) <a name='10.2'></a> 현시점에서는 generators는 이용하지 마십시오.

  > ES5로 잘 transpile 되지 않습니다.

  - [10.3](#10.3) <a name='10.3'></a> 어쩔 수 없이 Generator를 사용해야 한다면 eslint의 generator-star-spacing 룰을 따르세요.
  ```javascript
      // bad
    function * foo() {
      // ...
    }

    // bad
    const bar = function * () {
      // ...
    };

    // bad
    const baz = function *() {
      // ...
    };

    // bad
    const quux = function*() {
      // ...
    };

    // bad
    function*foo() {
      // ...
    }

    // bad
    function *foo() {
      // ...
    }

    // very bad
    function
    *
    foo() {
      // ...
    }

    // very bad
    const wat = function
    *
    () {
      // ...
    };

    // good
    function* foo() {
      // ...
    }

    // good
    const foo = function* () {
      // ...
    };
  ```

**[↑ 목차로 이동](#javascript-목차)**


## 프로퍼티(Properties)

  - [11.1](#11.1) <a name='11.1'></a> 프로퍼티에 억세스하는 경우는 점 `.` 을 사용해 주십시오.

    ```javascript
    const luke = {
      jedi: true,
      age: 28,
    };

    // bad
    const isJedi = luke['jedi'];

    // good
    const isJedi = luke.jedi;
    ```

  - [11.2](#11.2) <a name='11.2'></a> 변수를 사용해 프로퍼티에 억세스하는 경우는 대괄호 `[]` 를 사용해 주십시오.

    ```javascript
    const luke = {
      jedi: true,
      age: 28,
    };

    function getProp(prop) {
      return luke[prop];
    }

    const isJedi = getProp('jedi');
    ```

**[↑ 목차로 이동](#javascript-목차)**


## 변수(Variables)

  - [12.1](#12.1) <a name='12.1'></a> 변수를 선언 할 때는 항상 `const` 를 사용해 주십시오. 그렇게 하지 않으면 글로벌 변수로 선언됩니다. 글로벌 namespace 를 오염시키지 않도록 캡틴플래닛도 경고하고 있습니다.

    ```javascript
    // bad
    superPower = new SuperPower();

    // good
    const superPower = new SuperPower();
    ```

  - [12.2](#12.2) <a name='12.2'></a> 하나의 변수선언에 대해 하나의 `const` 를 이용해 주십시오.

    > 왜? 이 방법의 경우, 간단히 새 변수를 추가하는게 가능합니다. 또한 `,` 를 `;` 로 바꿔버리는 것에 대해 걱정할 필요가 없습니다.

    ```javascript
    // bad
    const items = getItems(),
        goSportsTeam = true,
        dragonball = 'z';

    // bad
    // (compare to above, and try to spot the mistake)
    const items = getItems(),
        goSportsTeam = true;
        dragonball = 'z';

    // good
    const items = getItems();
    const goSportsTeam = true;
    const dragonball = 'z';
    ```

  - [12.3](#12.3) <a name='12.3'></a> 우선 `const` 를 그룹화하고 다음에 `let` 을 그룹화 해주십시오.

  > 이전에 할당한 변수에 대해 나중에 새 변수를 추가하는 경우에 유용합니다.

    ```javascript
    // bad
    let i, len, dragonball,
        items = getItems(),
        goSportsTeam = true;

    // bad
    let i;
    const items = getItems();
    let dragonball;
    const goSportsTeam = true;
    let len;

    // good
    const goSportsTeam = true;
    const items = getItems();
    let dragonball;
    let i;
    let length;
    ```

  - [12.4](#12.4) <a name='12.4'></a> 변수를 할당할때는 필요하고 합리적인 장소에 두시기 바랍니다.

  > 왜? `let` 과 `const` 는 블록스코프이기 때문입니다. 함수스코프가 아닙니다.

    ```javascript
    // good
    function() {
      test();
      console.log('doing stuff..');

      //..other stuff..

      const name = getName();

      if (name === 'test') {
        return false;
      }

      return name;
    }

    // bad - unnecessary function call
    // 필요없는 함수 호출
    function(hasName) {
      const name = getName();

      if (!hasName) {
        return false;
      }

      this.setFirstName(name);

      return true;
    }

    // good
    function(hasName) {
      if (!hasName) {
        return false;
      }

      const name = getName();
      this.setFirstName(name);

      return true;
    }
    ```

**[↑ 목차로 이동](#javascript-목차)**


  ## 호이스팅(Hoisting)

  - [13.1](#13.1) <a name='13.1'></a> `var` 선언은 할당이 없이 스코프의 선두에 hoist 됩니다. `const` 와 `let` 선언은[Temporal Dead Zones (TDZ)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone_and_errors_with_let) 라고 불리는 새로운 컨셉의 혜택을 받고 있습니다. 이것은 [왜 typeof 는 더이상 안전하지 않은가](http://es-discourse.com/t/why-typeof-is-no-longer-safe/15)를  알고있는 것이 중요합니다.

    ```javascript
    // (notDefined 가 글로벌변수에 존재하지 않는다고 판정한 경우.)
    // 당연히 에러가 발생합니다.
    function example() {
      console.log(notDefined); // => throws a ReferenceError
    }

    // 그 변수를 참조하는 코드의 뒤에서 그 변수를 선언한 경우
    // 변수가 hoist 된 상태에서 동작합니다..
    // 주의：`true` 라는 값 자체는 hoist 되지 않습니다.
    function example() {
      console.log(declaredButNotAssigned); // => undefined
      var declaredButNotAssigned = true;
    }

    // 인터프리터는 변수선언을 스코프의 선두에 hoist 합니다.
    // 위의 예는 다음과 같이 다시 쓸수 있습니다.
    function example() {
      let declaredButNotAssigned;
      console.log(declaredButNotAssigned); // => undefined
      declaredButNotAssigned = true;
    }

    // const 와 let 을 이용한 경우
    function example() {
      console.log(declaredButNotAssigned); // => throws a ReferenceError
      console.log(typeof declaredButNotAssigned); // => throws a ReferenceError
      const declaredButNotAssigned = true;
    }
    ```

  - [13.2](#13.2) <a name='13.2'></a> 익명함수의 경우 함수가 할당되기 전의 변수가 hoist 됩니다.

    ```javascript
    function example() {
      console.log(anonymous); // => undefined

      anonymous(); // => TypeError anonymous is not a function

      var anonymous = function() {
        console.log('anonymous function expression');
      };
    }
    ```

  - [13.3](#13.3) <a name='13.3'></a> 명명함수의 경우도 똑같이 변수가 hoist 됩니다. 함수명이나 함수본체는 hoist 되지 않습니다.

    ```javascript
    function example() {
      console.log(named); // => undefined

      named(); // => TypeError named is not a function

      superPower(); // => ReferenceError superPower is not defined

      var named = function superPower() {
        console.log('Flying');
      };
    }

    // 함수명과 변수명이 같은 경우도 같은 현상이 발생합니다.
    function example() {
      console.log(named); // => undefined

      named(); // => TypeError named is not a function

      var named = function named() {
        console.log('named');
      }
    }
    ```

  - [13.4](#13.4) <a name='13.4'></a> 함수선언은 함수명과 함수본체가 hoist 됩니다.

    ```javascript
    function example() {
      superPower(); // => Flying

      function superPower() {
        console.log('Flying');
      }
    }
    ```

  - 자세한 내용은 링크를 참조하세요. [JavaScript Scoping & Hoisting](http://www.adequatelygood.com/2010/2/JavaScript-Scoping-and-Hoisting/) by [Ben Cherry](http://www.adequatelygood.com/).

**[↑ 목차로 이동](#javascript-목차)**


  ## 조건식과 등가식(Comparison Operators & Equality)

  - [14.1](#14.1) <a name='14.1'></a> `==` 이나 `!=` 보다 `===` 와 `!==` 을 사용하세요.

  - [14.2](#14.2) <a name='14.2'></a> `if` 문과 같은 조건식은 `ToBoolean` 메소드에 의해 강제 형변환으로 평가되어 항상 아래와 같은 룰을 따릅니다.
    + **오브젝트** 는 **true** 로 평가됩니다.
    + **undefined** 는 **false** 로 평가됩니다.
    + **null** 은 **false** 로 평가됩니다.
    + **부울값** 은 **boolean형의 값** 으로 평가됩니다.
    + **수치** 는 **true** 로 평가됩니다. 하지만 **+0, -0, or NaN** 의 경우는 **false** 입니다.
    + **문자열** 은 **true** 로 평가됩니다. 하지만 빈문자 `''` 의 경우는 **false** 입니다.

    ```javascript
    if ([0]) {
      // true
      // An array is an object, objects evaluate to true
      // 배열은 오브젝트이므로 true 로 평가됩니다.
    }
    ```

  - [14.3](#14.3) <a name='14.3'></a> 단축형을 사용해 주십시오.

    ```javascript
    // bad
    if (name !== '') {
      // ...stuff...
    }

    // good
    if (name) {
      // ...stuff...
    }

    // bad
    if (collection.length > 0) {
      // ...stuff...
    }

    // good
    if (collection.length) {
      // ...stuff...
    }
    ```

  - [14.4](#14.4) <a name='14.4'></a> 더 자세한건 이쪽을 참고하세요. [Truth Equality and JavaScript](http://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/#more-2108) by Angus Croll.

**[↑ 목차로 이동](#javascript-목차)**


  ## 블록(Blocks)

  - [15.1](#15.1) <a name='15.1'></a> 복수행의 블록에는 중괄호 ({}) 를 사용해 주십시오.

    ```javascript
    // bad
    if (test)
      return false;

    // good
    if (test) return false;

    // good
    if (test) {
      return false;
    }

    // bad
    function() { return false; }

    // good
    function() {
      return false;
    }
    ```

  - [15.2](#15.2) <a name='15.2'></a> 복수행 블록의 `if` 와 `else` 를 이용하는 경우 `else` 는 `if` 블록 끝의 중괄호(})와 같은 행에 위치시켜 주십시오.

    ```javascript
    // bad
    if (test) {
      thing1();
      thing2();
    }
    else {
      thing3();
    }

    // good
    if (test) {
      thing1();
      thing2();
    } else {
      thing3();
    }
    ```


**[↑ 목차로 이동](#javascript-목차)**


  ## 코멘트(Comments)

  - [16.1](#16.1) <a name='16.1'></a> 복수행의 코멘트는 `/** ... */` 을 사용합니다. 그 안에는 설명과 모든 파라메터, 반환값에 대해 형이나 값을 기술해주세요.

    ```javascript
    // bad
    // make() returns a new element
    // based on the passed in tag name
    //
    // @param {String} tag
    // @return {Element} element
    function make(tag) {

      // ...stuff...

      return element;
    }

    // good
    /**
     * make() returns a new element
     * based on the passed in tag name
     *
     * @param {String} tag
     * @return {Element} element
     */
    function make(tag) {

      // ...stuff...

      return element;
    }
    ```

  - [16.2](#16.2) <a name='16.2'></a> 단일행 코멘트에는 `//` 을 사용합니다. 코멘트를 추가하고 싶은 코드의 상부에 배치해주세요. 또한, 코멘트의 앞에 빈행을 넣어 주세요.

    ```javascript
    // bad
    const active = true;  // is current tab

    // good
    // is current tab
    const active = true;

    // bad
    function getType() {
      console.log('fetching type...');
      // set the default type to 'no type'
      const type = this._type || 'no type';

      return type;
    }

    // good
    function getType() {
      console.log('fetching type...');

      // set the default type to 'no type'
      const type = this._type || 'no type';

      return type;
    }

    // also good
    function getType() {
      // set the default type to 'no type'
      const type = this._type || 'no type';

      return type;
    }
    ```

  - [16.3](#16.3) <a name='16.3'></a> 문제를 지적하고 재고를 촉구하는 경우나 문제의 해결책을 제안하는 경우 등, 코멘트의 앞에  `FIXME` 나 `TODO` 를 붙이는 것으로 다른 개발자의 빠른 이해를 도울수 있습니다. 이런것들은 어떤 액션을 따른다는 의미로 통상의 코멘트와는 다릅니다. 액션이라는 것은 `FIXME -- 해결이 필요` 또는 `TODO -- 구현이 필요` 를 뜻합니다.

  - [16.4](#16.4) <a name='16.4'></a> 문제에 대한 주석으로써 `// FIXME:` 를 사용해 주십시오.

    ```javascript
    class Calculator extends Abacus {
      constructor() {
        super();

        // FIXME: 글로벌변수를 사용해서는 안됨.
        total = 0;
      }
    }
    ```

  - [16.5](#16.5) <a name='16.5'></a> 문제의 해결책에 대한 주석으로 `// TODO:` 를 사용해 주십시오.

    ```javascript
    class Calculator extends Abacus {
      constructor() {
        super();

        // TODO: total 은 옵션 파라메터로 설정해야함.
        this.total = 0;
      }
    }
    ```

**[↑ 목차로 이동](#javascript-목차)**


  ## 공백(Whitespace)

  - [17.1](#17.1) <a name='17.1'></a> 탭에는 스페이스 4개를 설정해 주십시오.

    ```javascript
    // bad
    function() {
    ∙const name;
    }

    // bad
    function() {
    ∙∙const name;
    }

    // good
    function() {
    ∙∙∙∙const name;
    }
    ```

  - [17.2](#17.2) <a name='17.2'></a> 주요 중괄호 ({}) 앞에는 스페이스를 1개 넣어 주십시오.

    ```javascript
    // bad
    function test(){
      console.log('test');
    }

    // good
    function test() {
      console.log('test');
    }

    // bad
    dog.set('attr',{
      age: '1 year',
      breed: 'Bernese Mountain Dog',
    });

    // good
    dog.set('attr', {
      age: '1 year',
      breed: 'Bernese Mountain Dog',
    });
    ```

  - [17.3](#17.3) <a name='17.3'></a> 제어구문 (`if` 문이나 `while` 문 등) 의 소괄호 (()) 앞에는 스페이스를 1개 넣어 주세요. 함수선언이나 함수호출시 인수리스트의 앞에는 스페이스를 넣지 마세요..

    ```javascript
    // bad
    if(isJedi) {
      fight ();
    }

    // good
    if (isJedi) {
      fight();
    }

    // bad
    function fight () {
      console.log ('Swooosh!');
    }

    // good
    function fight() {
      console.log('Swooosh!');
    }
    ```

  - [17.4](#17.4) <a name='17.4'></a> 연산자 사이에는 스페이스를 넣어 주십시오.

    ```javascript
    // bad
    const x=y+5;

    // good
    const x = y + 5;
    ```

  - [17.5](#17.5) <a name='17.5'></a> 파일 끝에는 개행문자를 1개 넣어 주십시오.

    ```javascript
    // bad
    (function(global) {
      // ...stuff...
    })(this);
    ```

    ```javascript
    // bad
    (function(global) {
      // ...stuff...
    })(this);↵
    ↵
    ```

    ```javascript
    // good
    (function(global) {
      // ...stuff...
    })(this);↵
    ```


  - [17.6](#17.6) <a name='17.6'></a> 길게 메소드를 채이닝하는 경우는 인덴트를 이용해 주십시오. 행이 새로운 문이 아닌 메소드 호출인 것을 강조하기 위해서 선두에 점 (.) 을 배치해 주십시오.

    ```javascript
    // bad
    $('#items').find('.selected').highlight().end().find('.open').updateCount();

    // bad
    $('#items').
      find('.selected').
        highlight().
        end().
      find('.open').
        updateCount();

    // good
    $('#items')
      .find('.selected')
        .highlight()
        .end()
      .find('.open')
        .updateCount();

    // bad
    const leds = stage.selectAll('.led').data(data).enter().append('svg:svg').class('led', true)
        .attr('width', (radius + margin) * 2).append('svg:g')
        .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
        .call(tron.led);

    // good
    const leds = stage.selectAll('.led')
        .data(data)
      .enter().append('svg:svg')
        .classed('led', true)
        .attr('width', (radius + margin) * 2)
      .append('svg:g')
        .attr('transform', 'translate(' + (radius + margin) + ',' + (radius + margin) + ')')
        .call(tron.led);
    ```

  - [17.7](#17.7) <a name='17.7'></a> 문의 앞과 블록의 뒤에는 빈행을 남겨 주십시오.

    ```javascript
    // bad
    if (foo) {
      return bar;
    }
    return baz;

    // good
    if (foo) {
      return bar;
    }

    return baz;

    // bad
    const obj = {
      foo() {
      },
      bar() {
      },
    };
    return obj;

    // good
    const obj = {
      foo() {
      },

      bar() {
      },
    };

    return obj;

    // bad
    const arr = [
      function foo() {
      },
      function bar() {
      },
    ];
    return arr;

    // good
    const arr = [
      function foo() {
      },

      function bar() {
      },
    ];

    return arr;
    ```

  - [17.8](#17.8) <a name='17.8'></a> 블록에 빈행을 끼워 넣지 마십시오.

    ```javascript
    // bad
    function bar() {

      console.log(foo);

    }

    // also bad
    if (baz) {

      console.log(qux);
    } else {
      console.log(foo);

    }

    // good
    function bar() {
      console.log(foo);
    }

    // good
    if (baz) {
      console.log(qux);
    } else {
      console.log(foo);
    }
    ```

  - [17.9](#17.9) <a name='17.9'></a> 소괄호()의 안쪽에 스페이스를 추가하지 마십시오.

    ```javascript
    // bad
    function bar( foo ) {
      return foo;
    }

    // good
    function bar(foo) {
      return foo;
    }

    // bad
    if ( foo ) {
      console.log(foo);
    }

    // good
    if (foo) {
      console.log(foo);
    }
    ```

  - [17.10](#17.10) <a name='17.10'></a> 대괄호([])의 안쪽에 스페이스를 추가하지 마십시오.

    ```javascript
    // bad
    const foo = [ 1, 2, 3 ];
    console.log(foo[ 0 ]);

    // good
    const foo = [1, 2, 3];
    console.log(foo[0]);
    ```

  - [17.11](#17.11) <a name='17.11'></a> 중괄호({})의 안쪽에 스페이스를 추가해 주십시오.

    ```javascript
    // bad
    const foo = {clark: 'kent'};

    // good
    const foo = { clark: 'kent' };
    ```

**[↑ 목차로 이동](#javascript-목차)**

  ## 콤마(Commas)

  - [18.1](#18.1) <a name='18.1'></a> 문장 앞에 콤마는 **사용하지 않습니다.**

    ```javascript
    // bad
    const story = [
        once
      , upon
      , aTime
    ];

    // good
    const story = [
      once,
      upon,
      aTime,
    ];

    // bad
    const hero = {
        firstName: 'Ada'
      , lastName: 'Lovelace'
      , birthYear: 1815
      , superPower: 'computers'
    };

    // good
    const hero = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      birthYear: 1815,
      superPower: 'computers',
    };
    ```

  - [18.2](#18.2) <a name='18.2'></a> 객체, 배열 아이템의 마지막 항목 끝에 콤마를 **사용합니다.**

    > 이것은 깨끗한 git의 diffs 로 이어집니다. 또한 Babel과 같은 트랜스파일러는 transpile 하는 사이에 쓸데없는 끝의 콤마를 제거합니다. 이것은 레거시브라우저에서의 [불필요한 콤마 문제](./README.md#commas)를 고민할 필요가 없다는것을 의미합니다.

    ```javascript
    // bad - git diff without trailing comma
    const hero = {
         firstName: 'Florence',
    -    lastName: 'Nightingale'
    +    lastName: 'Nightingale',
    +    inventorOf: ['coxcomb graph', 'modern nursing']
    };

    // good - git diff with trailing comma
    const hero = {
         firstName: 'Florence',
         lastName: 'Nightingale',
    +    inventorOf: ['coxcomb chart', 'modern nursing'],
    };

    // bad
    const hero = {
      firstName: 'Dana',
      lastName: 'Scully'
    };

    const heroes = [
      'Batman',
      'Superman'
    ];

    // good
    const hero = {
      firstName: 'Dana',
      lastName: 'Scully',
    };

    const heroes = [
      'Batman',
      'Superman',
    ];
    ```

**[↑ 목차로 이동](#javascript-목차)**


## 세미콜론(Semicolons)

  - [19.1](#19.1) <a name='19.1'></a> 문장의 마지막에는 반드시 세미콜론을 **써줍니다**

    ```javascript
    // bad
    (function() {
      const name = 'Skywalker'
      return name
    })()

    // good
    (() => {
      const name = 'Skywalker';
      return name;
    })();

    // good (guards against the function becoming an argument when two files with IIFEs are concatenated)
    // good (즉시함수가 연결된 2개의 파일일때 인수가 되는 부분을 보호합니다.
    ;(() => {
      const name = 'Skywalker';
      return name;
    })();
    ```

    [즉시함수 세미콜린에 대한 자세한 내용은 여기를 참조하세요](http://stackoverflow.com/questions/7365172/semicolon-before-self-invoking-function/7365214%237365214).

**[↑ 목차로 이동](#javascript-목차)**


## 형변환과 강제(Type Casting & Coercion)

  - [20.1](#20.1) <a name='20.1'></a> 문장의 앞 부분에서 형의 강제를 행합니다.

  - [20.2](#20.2) <a name='20.2'></a> String의 경우:

    ```javascript
    //  => this.reviewScore = 9;

    // bad
    const totalScore = this.reviewScore + '';

    // good
    const totalScore = String(this.reviewScore);
    ```

  - [20.3](#20.3) <a name='20.3'></a> Number의 경우: `Number` 로 형변환하는 경우는 `parseInt` 를 이용하고, 항상 형변환을 위한 진수를 인수로 넘겨 주십시오.

    ```javascript
    const inputValue = '4';

    // bad
    const val = new Number(inputValue);

    // bad
    const val = +inputValue;

    // bad
    const val = inputValue >> 0;

    // bad
    const val = parseInt(inputValue);

    // good
    const val = Number(inputValue);

    // good
    const val = parseInt(inputValue, 10);
    ```

  - [20.4](#20.4) <a name='20.4'></a> `parseInt` 가 bottleneck 이 되어, [성능적인 이유](http://jsperf.com/coercion-vs-casting/3)로 Bitshift를 사용할 필요가 있는 경우
  하려고 했던 것에 대해, 왜(why) 와 무엇(what)의 설명을 코멘트로 해서 남겨 주십시오.

    ```javascript
    // good
    /**
     * parseInt was the reason my code was slow.
     * Bitshifting the String to coerce it to a
     * Number made it a lot faster.
     * parseInt 가 원인으로 느렸음.
     * Bitshift를 통한 수치로의 문자열 강제 형변환으로
     * 성능을 개선시킴.
     */
    const val = inputValue >> 0;
    ```

  - [20.5](#20.5) <a name='20.5'></a> **주의:** bitshift를 사용하는 경우의 주의사항. 수치는 [64비트 값](http://es5.github.io/#x4.3.19)으로 표현되어 있으나 bitshift 연산한 경우는 항상 32비트 integer 로 넘겨집니다.([소스](http://es5.github.io/#x11.7)).
  32비트 이상의 int 를 bitshift 하는 경우 예상치 못한 현상을 야기할 수 있습니다.([토론](https://github.com/airbnb/javascript/issues/109)) 부호가 포함된 32비트 정수의 최대치는 2,147,483,647 입니다.

    ```javascript
    2147483647 >> 0 //=> 2147483647
    2147483648 >> 0 //=> -2147483648
    2147483649 >> 0 //=> -2147483647
    ```

  - [20.6](#20.6) <a name='20.6'></a> Boolean 경우:

    ```javascript
    const age = 0;

    // bad
    const hasAge = new Boolean(age);

    // good
    const hasAge = Boolean(age);

    // good
    const hasAge = !!age;
    ```

**[↑ 목차로 이동](#javascript-목차)**


## 명명규칙(Naming Conventions)

  - [21.1](#21.1) <a name='21.1'></a> 한글자 이름은 사용하지 않습니다. 이름에 의도가 드러나게 명명합니다.

    ```javascript
    // bad
    function q() {
      // ...stuff...
    }

    // good
    function query() {
      // ..stuff..
    }
    ```

  - [21.2](#21.2) <a name='21.2'></a> 오브젝트, 함수 그리고 인스턴스에는 camelCase를 사용합니다.

    ```javascript
    // bad
    const OBJEcttsssss = {};
    const this_is_my_object = {};
    function c() {}

    // good
    const thisIsMyObject = {};
    function thisIsMyFunction() {}
    ```

  - [21.3](#21.3) <a name='21.3'></a> 클래스나 constructor에는 PascalCase 를 사용합니다.

    ```javascript
    // bad
    function user(options) {
      this.name = options.name;
    }

    const bad = new user({
      name: 'nope',
    });

    // good
    class User {
      constructor(options) {
        this.name = options.name;
      }
    }

    const good = new User({
      name: 'yup',
    });
    ```

  - [21.4](#21.4) <a name='21.4'></a> private 프로퍼티명은 선두에 언더스코어 `_` 를 사용합니다.

    ```javascript
    // bad
    this.__firstName__ = 'Panda';
    this.firstName_ = 'Panda';

    // good
    this._firstName = 'Panda';
    ```

  - [21.5](#21.5) <a name='21.5'></a> `this` 의 참조를 보존하는 것은 사용하지 않습니다.. arrow함수나 Function#bind를 사용합니다..

    ```javascript
    // bad
    function foo() {
      const self = this;
      return function() {
        console.log(self);
      };
    }

    // bad
    function foo() {
      const that = this;
      return function() {
        console.log(that);
      };
    }

    // good
    function foo() {
      return () => {
        console.log(this);
      };
    }
    ```

  - [21.6](#21.6) <a name='21.6'></a> 파일을 1개의 클래스로 export 하는 경우, 파일명은 클래스명과 완전히 일치 시킵니다.

    ```javascript
    // file contents
    class CheckBox {
      // ...
    }
    export default CheckBox;

    // in some other file
    // bad
    import CheckBox from './checkBox';

    // bad
    import CheckBox from './check_box';

    // good
    import CheckBox from './CheckBox';
    ```

  - [21.7](#21.7) <a name='21.7'></a> Default export가 함수일 경우, camelCase를 이용해 주십시오. 파일명은 함수명과 동일해야 합니다.

    ```javascript
    function makeStyleGuide() {
    }

    export default makeStyleGuide;
    ```

  - [21.8](#21.8) <a name='21.8'></a> singleton / function library / 빈오브젝트를 export 하는 경우, PascalCase를 이용해 주십시오.

    ```javascript
    const AirbnbStyleGuide = {
      es6: {
      }
    };

    export default AirbnbStyleGuide;
    ```


**[↑ 목차로 이동](#javascript-목차)**


## 접근자(Accessors)

  - [22.1](#22.1) <a name='22.1'></a> 프로퍼티를 위한 접근자 (Accessor) 함수는 필수는 아닙니다.

  - [22.2](#22.2) <a name='22.2'></a> 접근자 함수가 필요한 경우, `getVal()` 이나 `setVal('hello')` 를 사용합니다.

    ```javascript
    // bad
    dragon.age();

    // good
    dragon.getAge();

    // bad
    dragon.age(25);

    // good
    dragon.setAge(25);
    ```

  - [22.3](#22.3) <a name='22.3'></a> 프로퍼티가 `boolean` 인 경우, `isVal()` 이나 `hasVal()` 를 사용합니다.

    ```javascript
    // bad
    if (!dragon.age()) {
      return false;
    }

    // good
    if (!dragon.hasAge()) {
      return false;
    }
    ```

  - [22.4](#22.4) <a name='22.4'></a> 일관되게 작성한 경우, `get()` 과 `set()` 으로 함수를 작성해도 좋습니다.

    ```javascript
    class Jedi {
      constructor(options = {}) {
        const lightsaber = options.lightsaber || 'blue';
        this.set('lightsaber', lightsaber);
      }

      set(key, val) {
        this[key] = val;
      }

      get(key) {
        return this[key];
      }
    }
    ```

**[↑ 목차로 이동](#javascript-목차)**


## 이벤트(Events)

  - [23.1](#23.1) <a name='23.1'></a> (DOM이벤트나 Backbone events 와 같은 독자의) 이벤트로 payload의 값을 넘길 경우는 raw값 보다는 해시값을 넘겨 주십시오.
이렇게 함으로써, 이후 기여자가 이벤트에 관련한 모든 핸들러를 찾아서 갱신하는 대신 이벤트 payload에 값을 추가하는 것이 가능합니다. 예를들면 아래와 같이

    ```javascript
    // bad
    $(this).trigger('listingUpdated', listing.id);

    ...

    $(this).on('listingUpdated', function(e, listingId) {
      // do something with listingId
    });
    ```

    아래가 좀더 좋습니다:

    ```javascript
    // good
    $(this).trigger('listingUpdated', { listingId: listing.id });

    ...

    $(this).on('listingUpdated', function(e, data) {
      // do something with data.listingId
    });
    ```

  **[↑ 목차로 이동](#목차)**


## jQuery

  - [24.1](#24.1) <a name='24.1'></a> jQuery오브젝트의 변수는 선두에 `$` 를 붙입니다.

    ```javascript
    // bad
    const sidebar = $('.sidebar');

    // good
    const $sidebar = $('.sidebar');

    // good
    const $sidebarBtn = $('.sidebar-btn');
    ```

  - [24.2](#24.2) <a name='24.2'></a> jQuery의 검색결과를 캐시해서 사용합니다.

    ```javascript
    // bad
    function setSidebar() {
      $('.sidebar').hide();

      // ...stuff...

      $('.sidebar').css({
        'background-color': 'pink'
      });
    }

    // good
    function setSidebar() {
      const $sidebar = $('.sidebar');
      $sidebar.hide();

      // ...stuff...

      $sidebar.css({
        'background-color': 'pink'
      });
    }
    ```

  - [24.3](#24.3) <a name='24.3'></a> DOM 검색에는 `$('.sidebar ul')` 이나 `$('.sidebar > ul')` 와 같은 Cascading 을 사용합니다. [jsPerf](http://jsperf.com/jquery-find-vs-context-sel/16)

  - [24.4](#24.4) <a name='24.4'></a> 한정된 jQuery 오브젝트 쿼리에는 `find` 를 사용합니다.

    ```javascript
    // bad
    $('ul', '.sidebar').hide();

    // bad
    $('.sidebar').find('ul').hide();

    // good
    $('.sidebar ul').hide();

    // good
    $('.sidebar > ul').hide();

    // good
    $sidebar.find('ul').hide();
    ```

**[↑ 목차로 이동](#javascript-목차)**


## 기본규칙

  - 파일당 하나의 컴포넌트 파일만 포함한다.
    - 하지만, 다수의 [Stateless, or Pure, Components](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions) 들은 파일에 존재해도 된다. eslint: [`react/no-multi-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md#ignorestateless).
  - 항상 JSX 구문을 사용한다.
  - 만약 JSX를 이용해 앱을 개발 중이라면 `React.createElement` 구문을 사용하지 않는다.

**[↑ 목차로 이동](#react-목차)**

## Class vs `React.createClass` vs stateless

  - 만약 소스 안에 state나 refs가 있으면, `React.createClass` 보다는 `class extends React.Component` 를 선호하라. 믹스인을 사용해야 하는 특별히 좋은 이유가 있으면 그렇지 않아도 된다. eslint: [`react/prefer-es6-class`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md) [`react/prefer-stateless-function`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md)

    ```jsx
    // bad
    const Listing = React.createClass({
      // ...
      render() {
        return <div>{this.state.hello}</div>;
      }
    });

    // good
    class Listing extends React.Component {
      // ...
      render() {
        return <div>{this.state.hello}</div>;
      }
    }
    ```

    그리고 만약 소스 안에 state나 refs가 없다면, 일반 클래스 방식보다 일반 함수(화살표 함수 아님) 방식을 선호하라.:

    ```jsx
    // bad
    class Listing extends React.Component {
      render() {
        return <div>{this.props.hello}</div>;
      }
    }

    // bad (익명함수의 형태이므로 함수의 이름을 추론해야하기 때문에 비추천)
    const Listing = ({ hello }) => (
      <div>{hello}</div>
    );

    // good
    function Listing({ hello }) {
      return <div>{hello}</div>;
    }
    ```

**[↑ 목차로 이동](#react-목차)**

## 명명규칙

  - **확장자**: 리엑트 컴포넌트 파일에는 `.js` 확장자를 사용한다.
  - **파일 이름**: 파스칼 형식의  이름을 사용한다. E.g., `ReservationCard.js`.
  - **참조 값 이름**: 인스턴스는 카멜 형식으로, 리엑트 컴포넌트는 파스칼 형식의 이름을 사용한다. eslint: [`react/jsx-pascal-case`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md)

    ```jsx
    // bad
    import reservationCard from './ReservationCard';

    // good
    import ReservationCard from './ReservationCard';

    // bad
    const ReservationItem = <ReservationCard />;

    // good
    const reservationItem = <ReservationCard />;
    ```

  - **컴포넌트 이름**: 파일 이름과 동일하게 사용한다. 예를들어, `ReservationCard.js` 라는 파일 안에는 `ReservationCard` 라는 이름의 컴포넌트가 있어야 한다. 하지만, 폴더 내 루트 컴포넌트의 경우에는, 파일 이름을 `index.js` 로 작성하고, 폴더의 이름을 컴포넌트의 이름으로 작성한다.:

    ``` jsx
    // bad
    import Footer from './Footer/Footer';

    // bad
    import Footer from './Footer/index';

    // good
    import Footer from './Footer';
    ```

  - **상위 컴포넌트 이름**: 상위 컴포넌트의 displayName 속성 값과 하위 컴포넌트의 displayName 속성 값을 활용하여 새롭게 만들어진 컴포넌트의 이름을 만든다. 예를들어, 상위 컴포넌트 withFoo()에서, Bar 라는 하위 컴포넌트가 인자로 넘어왔을 때, 생성되는 컴포넌트의 displayName 속성 값은 withFoo(Bar)이 된다.

  > 이유? 컴포넌트의 displayName 속성은 개발자 도구나 에러 메세지를 확인하기 위해 사용된다. 이 값을 확실하게 넣어줘야 사람들이 이러한 문제를 겪거나 컴포넌트 간의 관계 파악을 할 때 도움이 된다.
  
  ``` jsx
  // bad
  export default function withFoo(WrappedComponent) {
    return function WithFoo(props) {
      return <WrappedComponent {...props} foo />;
    }
  }

  // good
  export default function withFoo(WrappedComponent) {
    function WithFoo(props) {
      return <WrappedComponent {...props} foo />;
    }
    const wrappedComponentName = WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component';
    
    WithFoo.displayName = `withFoo(${wrappedComponentName})`;
    return WithFoo;
  }
  ```

**[↑ 목차로 이동](#react-목차)**

## 선언

  - 컴포넌트의 이름을 지을 때 `displayName` 속성을 사용하지 않는다. 대신에 참조 값으로 컴포넌트의 이름을 짓는다.

    ```jsx
    // bad
    export default React.createClass({
      displayName: 'ReservationCard',
      // stuff goes here
    });

    // good
    export default class ReservationCard extends React.Component {
    }
    ```

**[↑ 목차로 이동](#react-목차)**

## 정렬

  - JSX 구문을 위해서는 아래의 정렬 방식을 따른다. eslint: [`react/jsx-closing-bracket-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md)

    ```jsx
    // bad
    <Foo superLongParam="bar"
         anotherSuperLongParam="baz" />

    // good
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    />

    // 만약 props가 하나면 같은 줄에 둔다.
    <Foo bar="bar" />

    // 자식 컴포넌트는 보통 들여쓴다.
    <Foo
      superLongParam="bar"
      anotherSuperLongParam="baz"
    >
      <Quux />
    </Foo>
    ```

**[↑ 목차로 이동](#react-목차)**

## 따옴표

  - JSX 속성값에는 항상 쌍따옴표 (`"`) 를 사용한다. 하지만 다른 자바스크립트에서는 홑따옴표를 사용한다. eslint: [`jsx-quotes`](http://eslint.org/docs/rules/jsx-quotes)

  > 왜? JSX 속성은 [escaped quotes를 가질수 없다.](http://eslint.org/docs/rules/jsx-quotes), 그래서 쌍따옴표는 해당 타입에 쉽게 `"멈춤 or 그만"` 이라는 의미를 심어준다.
  > HTML 속성들도 보통 홑따옴표 대신 쌍따옴표를 사용한다. 그래서 JSX 속성은 이러한 컨벤션을 따라간다.

    ```jsx
    // bad
    <Foo bar='bar' />

    // good
    <Foo bar="bar" />

    // bad
    <Foo style={{ left: "20px" }} />

    // good
    <Foo style={{ left: '20px' }} />
    ```

**[↑ 목차로 이동](#react-목차)**

## 띄어쓰기

 - 닫힘 태그에는 항상 한 칸짜리 빈 공간을 가진다.

    ```jsx
    // bad
    <Foo/>

    // very bad
    <Foo                 />

    // bad
    <Foo
     />

    // good
    <Foo />
    ```

  - JSX 중괄호에 빈 공간을 덧대지 않는다. eslint: [`react/jsx-curly-spacing`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md)

    ```jsx
    // bad
    <Foo bar={ baz } />

    // good
    <Foo bar={baz} />
    ```

**[↑ 목차로 이동](#react-목차)**

## 속성

 - 속성의 이름은 항상 카멜케이스를 사용한다.

    ```jsx
    // bad
    <Foo
      UserName="hello"
      phone_number={12345678}
    />

    // good
    <Foo
      userName="hello"
      phoneNumber={12345678}
    />
    ```

  - 만약 속성 값이 명확한 `true` 값이라면 생략한다. eslint: [`react/jsx-boolean-value`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md)

    ```jsx
    // bad
    <Foo
      hidden={true}
    />

    // good
    <Foo
      hidden
    />
    ```

  - `<img>` 태그에는 항상 `alt` 속성을 작성한다. 만약 이미지가 표현 가능하다면, `alt` 값은 빈 문자열이 될 수 있거나 `<img>`는 반드시 `role="presentation"` 속성을 가지고 있어야 한다. eslint: [`jsx-a11y/img-has-alt`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-has-alt.md)

    ```jsx
    // bad
    <img src="hello.jpg" />

    // good
    <img src="hello.jpg" alt="Me waving hello" />

    // good
    <img src="hello.jpg" alt="" />

    // good
    <img src="hello.jpg" role="presentation" />
    ```

  - `<img>` 태그의 `alt` 속성 값으로 "image", "photo", "picture" 와 같은 단어를 사용하면 안 된다. eslint: [`jsx-a11y/img-redundant-alt`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md)

  > 왜? 스크린리더는 이미 `img` 태그를 이미지로 인지하고 있기 때문에, alt 속성 값에 반복으로 해당 정보를 포함할 필요가 없다.

    ```jsx
    // bad
    <img src="hello.jpg" alt="Picture of me waving hello" />

    // good
    <img src="hello.jpg" alt="Me waving hello" />
    ```

  - role 속성 값으로는 검증이 가능하고, 추상적이지 않은 값을 사용하라. [ARIA roles](https://www.w3.org/TR/wai-aria/roles#role_definitions). eslint: [`jsx-a11y/aria-role`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md)

    ```jsx
    // bad - not an ARIA role
    <div role="datepicker" />

    // bad - abstract ARIA role
    <div role="range" />

    // good
    <div role="button" />
    ```

  - 엘리먼트에 `accessKey` 속성을 사용하면 안 된다. eslint: [`jsx-a11y/no-access-key`](https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key.md)

  > 왜? 키보드 단축값을 사용하는 스크린 리더 유저와 일반 키보드 유저간의 일관성이 없어져서 접근성을 복잡하게 만들기 때문이다.

  ```jsx
  // bad
  <div accessKey="h" />

  // good
  <div />
  ```

  - 배열의 인덱스를 `key` 속성 값으로 사용하는 것을 피하고, 유니크한 ID 값을 사용하라. ([why?](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318))

  ```jsx
  // bad
  {todos.map((todo, index) =>
    <Todo
      {...todo}
      key={index}
    />
  )}

  // good
  {todos.map(todo => (
    <Todo
      {...todo}
      key={todo.id}
    />
  ))}
  ```
  
**[↑ 목차로 이동](#react-목차)**

## 참조

 - 항상 참조 콜백 함수를 사용하라. eslint: react/no-string-refs

  ``` jsx
  // bad
  <Foo
    ref="myRef"
  />
  
  // good
  <Foo
    ref={(ref) => this.myRef = ref}
  />
  ```

**[↑ 목차로 이동](#react-목차)**

## 괄호

  - 만약 JSX 태그가 두 줄 이상으로 늘어난다면 괄호로 감싸야 한다. eslint: [`react/wrap-multilines`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/wrap-multilines.md)

    ```jsx
    // bad
    render() {
      return <MyComponent className="long body" foo="bar">
               <MyChild />
             </MyComponent>;
    }

    // good
    render() {
      return (
        <MyComponent className="long body" foo="bar">
          <MyChild />
        </MyComponent>
      );
    }

    // good, 한 줄이라면 괜찮다.
    render() {
      const body = <div>hello</div>;
      return <MyComponent>{body}</MyComponent>;
    }
    ```

**[↑ 목차로 이동](#react-목차)**

## 태그

  - 자식 컴포넌트가 없으면 항상 닫힘 태그를 사용한다. eslint: [`react/self-closing-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md)

    ```jsx
    // bad
    <Foo className="stuff"></Foo>

    // good
    <Foo className="stuff" />
    ```

  - 만약 컴포넌트가 다수의 속성을 가졌다면, 닫힘 태그는 새로운 줄에 작성한다. eslint: [`react/jsx-closing-bracket-location`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md)

    ```jsx
    // bad
    <Foo
      bar="bar"
      baz="baz" />

    // good
    <Foo
      bar="bar"
      baz="baz"
    />
    ```

**[↑ 목차로 이동](#react-목차)**

## 메소드

  - 지역 변수를 둘러싸기 위해서는 화살표 함수를 사용해라.

    ```jsx
    function ItemList(props) {
      return (
        <ul>
          {props.items.map((item, index) => (
            <Item
              key={item.key}
              onClick={() => doSomethingWith(item.name, index)}
            />
          ))}
        </ul>
      );
    }
    ```

  - render 메소드에 사용되는 이벤트 핸들러는 생성자에 바인드 해라. eslint: [`react/jsx-no-bind`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)

  > 왜? render 메소드 내에서 bind를 사용하게게 될 경우에는 새로운 렌더링마다 새로운 함수가 생성되기 때문이다.

    ```jsx
    // bad
    class extends React.Component {
      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv.bind(this)} />
      }
    }

    // good
    class extends React.Component {
      constructor(props) {
        super(props);

        this.onClickDiv = this.onClickDiv.bind(this);
      }

      onClickDiv() {
        // do stuff
      }

      render() {
        return <div onClick={this.onClickDiv} />
      }
    }
    ```

  - 리엑트 컴포넌트의 내부 메소드를 위해 언더바 문자를 사용하면 안 된다.

    ```jsx
    // bad
    React.createClass({
      _onClickSubmit() {
        // do stuff
      },

      // other stuff
    });

    // good
    class extends React.Component {
      onClickSubmit() {
        // do stuff
      }

      // other stuff
    }
    ```

  - `render` 메소드에서는 값을 리턴해야 한다. eslint: [`require-render-return`](https://github.com/yannickcr/eslint-plugin-react/pull/502)

    ```jsx
    // bad
    render() {
      (<div />);
    }

    // good
    render() {
      return (<div />);
    }
    ```

**[↑ 목차로 이동](#react-목차)**

## 순서

  - `class extends React.Component` 를 위한 순서:

  1. 선택적인 `static` 메소드
  1. `constructor`
  1. `getChildContext`
  1. `componentWillMount`
  1. `componentDidMount`
  1. `componentWillReceiveProps`
  1. `shouldComponentUpdate`
  1. `componentWillUpdate`
  1. `componentDidUpdate`
  1. `componentWillUnmount`
  1. *클릭 핸들러나 이벤트 핸들러* like `onClickSubmit()` or `onChangeDescription()`
  1. *`render`를 위한 게터 메소드* like `getSelectReason()` or `getFooterContent()`
  1. *선택적인 렌더 메소드* like `renderNavigation()` or `renderProfilePicture()`
  1. `render`

  - `propTypes`, `defaultProps`, `contextTypes`, etc... 를 정의하는 방법

    ```jsx
    import React, { PropTypes } from 'react';

    const propTypes = {
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      text: PropTypes.string,
    };

    const defaultProps = {
      text: 'Hello World',
    };

    class Link extends React.Component {
      static methodsAreOk() {
        return true;
      }

      render() {
        return <a href={this.props.url} data-id={this.props.id}>{this.props.text}</a>
      }
    }

    Link.propTypes = propTypes;
    Link.defaultProps = defaultProps;

    export default Link;
    ```

  - `React.createClass` 를 위한 순서: eslint: [`react/sort-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md)

  1. `displayName`
  1. `propTypes`
  1. `contextTypes`
  1. `childContextTypes`
  1. `mixins`
  1. `statics`
  1. `defaultProps`
  1. `getDefaultProps`
  1. `getInitialState`
  1. `getChildContext`
  1. `componentWillMount`
  1. `componentDidMount`
  1. `componentWillReceiveProps`
  1. `shouldComponentUpdate`
  1. `componentWillUpdate`
  1. `componentDidUpdate`
  1. `componentWillUnmount`
  1. *클릭 핸들러나 이벤트 핸들러* 예시. `onClickSubmit()` 혹은 `onChangeDescription()`
  1. *`render`를 위한 게터 메소드* 예시. `getSelectReason()` 혹은 `getFooterContent()`
  1. *선택적인 렌더 메소드* 예시. `renderNavigation()` 혹은 `renderProfilePicture()`
  1. `render`

**[↑ 목차로 이동](#react-목차)**

## `isMounted`

  - `isMounted` 를 사용하면 안 된다. eslint: [`react/no-is-mounted`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md)

  > 왜? `isMounted` 은 [안티 패턴이고,][anti-pattern] ES6 클래스 문법에 적용할 수 없을 뿐더러, 공식적으로 사라지게 될 예정이다.

  [anti-pattern]: https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
  
  
**[↑ 목차로 이동](#react-목차)**