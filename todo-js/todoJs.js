//로컬 스토리지에 있는 todo들 혹은 맨 처음의 빈 배열
let list = JSON.parse(localStorage.getItem('list')) || [];

const insertInput = document.querySelector('.new-todo');

const todoList = document.querySelector('.todo-list');
const todoMain = document.querySelector('.todo-main');
const todoFoot = document.querySelector('.todo-foot');

const filters = document.querySelector('.filters');

//task 추가
//insertInput에 할 일을 등록 하면 list에 해당 task를 추가하고, localStroage 에 저장 후 showList
const insertInputEvent = (e) => {
    if(insertInput.value.length > 0){
        const task = insertInput.value;
        const item = {
            id : new Date().getTime(),
            done : false,
            task
        };
        list.push(item);
        localStorage.setItem('list',JSON.stringify(list));
        showList(list, localStorage.getItem('state'));

        insertInput.value = "";
        insertInput.focus();
    }
}

insertInput.addEventListener('blur',insertInputEvent);
insertInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) insertInputEvent();
});

//Read
//li 안의 a태그에 selected 클래스를 추가하는 메서드
const selectState = (state) => {
    const liA = filters.querySelectorAll('li a');
    for(const a of liA){
        if(state == a.textContent){
            a.className = 'selected';
        }else{
            a.className = '';
        }
    }
}

//사용자가 가지고 있는 list 출력
const showList = (list = [], state) => {
    if(list.length > 0){
        todoMain.style.display = 'block';

        let filterArr;
        if(state == 'Active') filterArr = list.filter((item) => !item.done);
        else if(state == 'Completed') filterArr = list.filter((item) => item.done);
        else filterArr = list;
        
        todoList.innerHTML = filterArr.map((item, i) => {
            return `
            <li id="${item.id}" ${item.done ? 'class="completed"' : ''}>
                <div class="task">
                    <input type="checkbox" class="chk" data-index=${i} 
                        ${item.done ? 'checked' : ''} />
                    <label>${item.task}</label>
                    <button class="del"></button>
                </div>
            </li>
            `;
        }).join(''); //배열이 문자열로 바뀌면서 ( , )가 생기기 때문에 공백 발생 => join

        //목록 중 체크가 하나라도 풀리면 전체 체크박스 자동 해제, 
        //모든 목록이 다 체크 되었으면 전체 체크 박스 설정
        let chkLen = 0;
        for(const item of list){
            if(item.done) chkLen++;
        }

        if(chkLen == list.length) todoMain.firstElementChild.checked = true;
        else todoMain.firstElementChild.checked = false;

        todoFoot.firstElementChild.textContent = `${list.length - chkLen} items left`;

        if(chkLen > 0) todoFoot.lastElementChild.style.display = 'block';
        else todoFoot.lastElementChild.style.display = 'none';

        //지금 어떤 state인지 (a태그에 selected 되있는 곳) 보여줌
        selectState(localStorage.getItem('state'));
    }else{
        todoMain.style.display = 'none';
        localStorage.setItem('state','All');
    }
    
}

showList(list, localStorage.getItem('state'));

//Update, Delete 
const clickEvent = (e) => { //체크랑 삭제(Delete 기능)
    const el = e.target;

    if(!el.matches('.chk') && !el.matches('button')) return;

    let filterArr;
    const state = localStorage.getItem('state');
    
    if(state == 'Active') filterArr = list.filter((item) => !item.done);
    else if(state == 'Completed') filterArr = list.filter((item) => item.done);
    else filterArr = list;

    if(el.matches('.chk')){ //chk
        const idx = el.dataset.index;
        filterArr[idx].done = !filterArr[idx].done;
        localStorage.setItem('list', JSON.stringify(filterArr));
        
    }else if(el.matches('button')){ //del
        const id = el.closest('li').id;
        const idx = list.findIndex((item) => {
            return id == item.id;
        });
 
        list.splice(idx, 1);
        localStorage.setItem('list', JSON.stringify(list));
    }

    showList(list, state);
}

//update
const updateEvent = (e) => {
    const input = e.target;

    const id = input.parentNode.id;

    if(e.target.value.length > 0){
        const task = e.target.value;
        for(const item of list){
            if(id == item.id){
                item.task = task;
            }
        }
        
    }else{
        //update 할때 text 의 value 가 없으면 삭제가 되는데, 이 경우에 한번 더 이벤트가 발생해서 -1반환
        //그래서 반환된 idx가 -1보다 크면 splice (삭제) 할 수 있게 설정
        const idx = list.findIndex((item) => {
            return id == item.id;
        });
        if(idx > -1){
            list.splice(idx, 1);
        }
    }

    localStorage.setItem('list',JSON.stringify(list));
    showList(list, localStorage.getItem('state'));
}

//=> 더블클릭하면 => input type text가 보여짐
const dblclickEvent = (e) => {
    const el = e.target;

    const input = document.createElement("input");
    input.className = 'edit';
    input.value = el.textContent;

    if(el.matches('label')){
        el.parentNode.after(input);
        el.closest('li').className = 'editing';
        input.focus();

        input.addEventListener('blur', updateEvent); 
        input.addEventListener('keyup', (e) => {
            if(e.keyCode === 13) updateEvent(e);
        });

    }
}

todoList.addEventListener('click', clickEvent);
todoList.addEventListener('dblclick', dblclickEvent);

//체크박스
//전체 체크박스 => 체크상태 라면 done이 true, 체크를 푼다면 done이 false
const allChkEvent = (e) => {
    const el = e.target;
    if(el.checked){
        for(const item of list){
            item.done = true;
        }
    }else{
        for(const item of list){
            item.done = false;
        }
    }
    localStorage.setItem('list', JSON.stringify(list));
    showList(list, localStorage.getItem('state'));
}

todoMain.firstElementChild.addEventListener('click', allChkEvent);  //allChk

//filters
const filterEvent = (e) => {
    const el = e.target;
    //filters 안의 li 의 a태그들의 class 삭제
    const liA = filters.querySelectorAll('li a');
    for(const a of liA){
        a.classList.remove('selected');
    }
    el.className = 'selected';
    
    if(el.textContent == 'Active'){
        localStorage.setItem('state','Active');
    }else if(el.textContent == 'Completed'){
        localStorage.setItem('state', 'Completed');
    }else{
        localStorage.setItem('state', 'All');
    }
    showList(list,  localStorage.getItem('state'));
}

filters.addEventListener('click', filterEvent);

//clearCompleted
const clearEvent = (e) => {
    const arr = list.filter((item) => !item.done);
    list = arr;
    localStorage.setItem('list', JSON.stringify(arr));
    showList(arr, localStorage.getItem('state'));
}


todoFoot.lastElementChild.addEventListener('click', clearEvent);
