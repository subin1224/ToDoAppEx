//로컬 스토리지에 있는 todo들 혹은 맨 처음의 빈 배열
let list = JSON.parse(localStorage.getItem('list')) || [];
let state = localStorage.getItem('state');

const F_ALL = 0;
const F_ACTIVE = 1;
const F_COMPLETED = 2;

const insertInput = document.querySelector('.new-todo');

const todoList = document.querySelector('.todo-list');
const todoMain = document.querySelector('.todo-main');
const todoFoot = document.querySelector('.todo-foot');

const filters = document.querySelector('.filters');

//task 추가
//insertInput에 할 일을 등록 하면 list에 해당 task를 추가하고, localStroage 에 저장 후 showList
const insertInputEvent = (e) => {
    if(insertInput.value.trim().length > 0){
        const task = insertInput.value;
        const item = {
            id : new Date().getTime(),
            done : false,
            task
        };
        list.push(item);
        localStorage.setItem('list',JSON.stringify(list));
        showList(list, state);

        insertInput.value = "";
        insertInput.focus();
    }
}

insertInput.addEventListener('blur',insertInputEvent);
insertInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) insertInputEvent();
});

//Read
//현재 state 에 맞게 filters의 li태그들의 select 여부
const showState = (state) => {
    const liA = filters.querySelectorAll('li a');
    for(const a of liA){
        a.classList.remove('selected');
    }

    liA[state].className = 'selected';
}

//사용자가 가지고 있는 list 출력
const showList = (list = [], state) => {
    if(list.length > 0){
        todoMain.style.display = 'block';

        let filterArr;
        //F_ACTIVE / F_COMPLETED / F_ALL 은 숫자형, state는 문자열 => 더 나은 해결방법 ? 
        if(state == F_ACTIVE) filterArr = list.filter((item) => !item.done);
        else if(state == F_COMPLETED) filterArr = list.filter((item) => item.done);
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

        if(chkLen === list.length) document.querySelector('#allChk').checked = true;
        else document.querySelector('#allChk').checked = false;
        
        //Active 가 몇개인지 보여줌
        todoFoot.firstElementChild.textContent = `${list.length - chkLen} items left`;

        //Clear completed를 보여줌
        if(chkLen > 0) todoFoot.lastElementChild.style.display = 'block';
        else todoFoot.lastElementChild.style.display = 'none';

        showState(state);
    }else{
        todoMain.style.display = 'none';
        localStorage.setItem('state', F_ALL);
    }
    
}

showList(list, state);

//Update, Delete 
const clickEvent = (e) => { //체크랑 삭제(Delete 기능)
    const el = e.target;

    if(!el.matches('.chk') && !el.matches('button')) return;

    let filterArr;
    //state == 'Active' ? list.filter((item) => !item.done) : state == 'Completed' ? list.filter((item) => item.done) : list 

    if(state == F_ACTIVE) filterArr = list.filter((item) => !item.done);
    else if(state == F_COMPLETED) filterArr = list.filter((item) => item.done);
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
    showList(list, state);
}

//=> 더블클릭하면 => input type text가 보여짐
const dblclickEvent = (e) => {
    const el = e.target;

    const updateInput = document.createElement("input");
    updateInput.className = 'edit';
    updateInput.value = el.textContent;

    if(el.matches('label')){
        el.parentNode.after(updateInput);
        el.closest('li').className = 'editing';
        updateInput.focus();

        updateInput.addEventListener('blur', updateEvent); 
        updateInput.addEventListener('keyup', (e) => {
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
    showList(list, state);
}

document.querySelector('#allChk').addEventListener('click', allChkEvent);  //allChk

//filters
const filterEvent = (e) => {
    const el = e.target;
 
    if(el.textContent == 'Active'){
        localStorage.setItem('state',F_ACTIVE);
    }else if(el.textContent == 'Completed'){
        localStorage.setItem('state', F_COMPLETED);
    }else{
        localStorage.setItem('state', F_ALL);
    }
    state = localStorage.getItem('state');
    showList(list, state);
}

filters.addEventListener('click', filterEvent);

//clearCompleted
const clearEvent = (e) => {
    const arr = list.filter((item) => !item.done);
    list = arr;
    localStorage.setItem('list', JSON.stringify(arr));
    showList(arr, state);
}

todoFoot.lastElementChild.addEventListener('click', clearEvent);
