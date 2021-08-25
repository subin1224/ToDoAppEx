# 📋TodoApp 만들기

<p align="center"> 
    
![todos](https://user-images.githubusercontent.com/76253952/130717770-5187abb6-0d61-426a-89c8-960e99e433a1.png)
    
> HTML5, CSS3, ES6+ 를 이용하여 todoApp 제작하기
</p>


---
<br>
<br>
<br>



## ✨서비스 소개


: 사용자가 할 일을 기록하고 완료 한 일을 확인 할 수 있는 공간

---
<br>
<br>
<br>



## 💡 주요 기능


- 사용자가 할 일을 작성 할 수 있습니다.
    - 입력 하고 엔터키를 누르면 바로 작성이 가능해집니다. 이때, 최근에 추가 한 일은 목록 아래에 추가 됩니다.
    - 메모 한 텍스트 박스를 더블 클릭 하면 수정이 가능 합니다.
    - 마우스를 올리면 삭제 버튼이 나옵니다.
    
- 할 일과 완료 된 일을 구분 할 수 있습니다. (Active / Completed)
    - 리스트의 체크박스에 체크를 하면 자동으로 Completed 해집니다.
    - 완료 된 일도 수정이 가능 합니다.
    - 한꺼번에 완료 된 일을 삭제 할 수 있습니다. 뿐만 아니라 하나 하나 삭제 할 수 있습니다.
    - 몇 개의 일이 Active 상태 인지 알 수 있습니다.
    
- 입력란 옆에 있는 체크박스를 선택하면 손쉽게 모든 일 들이 Completed 됩니다.
    - 이때 하나라도 체크를 푼다면 해당 체크박스는 해제 됩니다.
    
- 하루가 지나도 작성한 목록들은 따로 삭제를 하지 않는 한 지워지지 않습니다.

---
<br>
<br>
<br>




## 📂 업데이트 내역


- 0.0.1
    - 요구 사항 정리 및 프로그램 구조 설계
- 0.0.2
    - 로컬스토리지를 이용하여 create, 체크박스로 상태 변경, read 작업 완료
- 0.0.3
    - 로컬스토리지에 state 추가, read 변경, insert-Event 추가, filter 기능 추가
- 0.0.4
    - update 기능 및 filter 를 적용 한 채로 CRUD 작업 완 (모든 기능 구현 완료)
    - 코드를 좀 더 깔끔하게 다듬는 작업 (1)
- 0.0.5
    - 코드 작업 (2)
    - ClearCompleted 누를시 list 가 업데이트 안되는 부분 수정
- 0.0.6
    - 코드 작업 (3)
 
- 1.0.0
    - 웹 컴포넌트 작업 (1)
    - → LocalStorage 적용을 위한 컴포넌트화 연구 및 todo items가 없을때의 제어를 어디서 걸어줄지 연구
- 1.0.1
    - 웹 컴포넌트 작업 (2)
    - → LocalStorage 가져오기 (filter, items 저장시킬예정)
    - blur 이벤트 오류, removeEvent 좀 더 연구
    - Drag & Drop 기능 추가 예정
    - 나머지 기본적인건 구현 완료 ( blur 이벤트 처리 빼고는 ... )
    => 렌더링 이후에 또 수정 되는건 어디서 작업해야 하는지,,, 결국 원점으로 돌아간것 같은 느낌ㅠ
- 1.0.2
    - Drag & Drop 작업 진행
    - Drop 요소 빼고 진행 완료 => Drop 하면 순서가 어떻게 될지, seq 가져오는 것 고민
    - 가이드 엘리먼트 ( bottom 만 작업 함 )
    - li요소 연구 필요
---
<br>
<br>
<br>




## 🔎 추가 사항


제작 하면서 새롭게 공부한 내용, 혹은 각종 이슈 해결은 해당 블로그에 기록 합니다.

[삔아의 블로그](https://bbinya.tistory.com/)
