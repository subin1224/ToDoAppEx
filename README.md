# 📋TodoApp 만들기

<p align="center"> 
<img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/46fe1461-a27a-4b17-a5ff-8ae1d87d436b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210812%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210812T052133Z&X-Amz-Expires=86400&X-Amz-Signature=4935de9466e9a69a3408bc84c7d04e96ca829d58dff9aa5f7e23607f859e6c43&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22">

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
---
<br>
<br>
<br>




## 🔎 추가 사항


제작 하면서 새롭게 공부한 내용, 혹은 각종 이슈 해결은 해당 블로그에 기록 합니다.

[삔아의 블로그](https://bbinya.tistory.com/)
