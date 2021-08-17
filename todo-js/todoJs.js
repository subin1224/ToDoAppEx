/*
로컬스토리지 저장을 어떻게 할지 ...
idx 추가해서, task 저장하기에는
delete 할때 좀 문제가 생길것 같고 ..
어떤것이 Active / complete 되었는지도 상태도 있어야 하고..
=> 객체 저장
*/
//로컬 스토리지에 있는 todo들 혹은 맨 처음의 빈 배열
let list =JSON.parse(localStorage.getItem('list')) || [];
const insert = document.querySelector('.new-todo');
const todoList = document.querySelector('.todo-list');
const todoMain = document.querySelector('.todo-main');
const todoFoot = document.querySelector('.todo-foot');
const filters = document.querySelector('.filters');

const clearCompleted = todoFoot.querySelector('.clear-completed');
const allChk = document.querySelector('.allChk');

showList(list, todoList, localStorage.getItem('state'));

//Create
function insertEvent(e){
    if(insert.value.length > 0){
        const task = insert.value;
        const item = {
            id : new Date().getTime(),
            done : false,
            task
        };
        list.push(item);
        localStorage.setItem('list',JSON.stringify(list));
        showList(list, todoList, localStorage.getItem('state'));

        insert.value="";
        insert.focus();
    }
}

//Q. 원래 todoApp에서는 Alt Enter나 Ctrl Enter 누르면 안됐는데
// 그럼 처리를 어떻게 해준걸까 TT
insert.addEventListener('blur',insertEvent);
insert.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13) insertEvent(this);
});

//Read
function selectState(state){
    const liA = filters.querySelectorAll('li a');
    
    for(const a of liA){
        if(state == a.innerText){
            a.className = 'selected';
        }else{
            a.className = '';
        }
    }
}


//로컬스토리지 학습 -> list.length >0 이면 todo-foot 나오게 변경
//map() 활용
function showList(list = [], todoList, state){
    if(list.length > 0){
        todoMain.style.display = 'block';

        let arr;
        if(state == 'Active') arr = list.filter((item) => !item.done);
        else if(state == 'Completed') arr = list.filter((item) => item.done);
        else arr = list;

        todoList.innerHTML = arr.map((item, i) => {
            return `
            <li class="${item.done ? 'completed' : ''}">
                <div class="task">
                    <input type="checkbox" class="chk" data-index=${i} 
                        ${item.done ? 'checked' : ''} />
                    <label>${item.task}</label>
                    <button class="del"></button>
                </div>
            </li>
            `;
        }).join(''); //join을 안쓰면 빈 공백이 생김

        //목록 중 체크가 하나라도 풀리면 전체 체크박스 자동 해제, 
        //모든 목록이 다 체크 되었으면 전체 체크 박스 설정
        let chkLen = 0;
        for(const item of list){
            if(item.done) chkLen++;
        }

        if(chkLen == list.length) allChk.checked = true;
        else allChk.checked = false;

        const todoCnt = todoFoot.querySelector('.todo-count');
        todoCnt.textContent = `${list.length - chkLen} items left`;

        if(chkLen > 0) clearCompleted.style.display = 'block';
        else clearCompleted.style.display = 'none';

        selectState(localStorage.getItem('state'));
    }else{
        todoMain.style.display = 'none';
    }
    
}


//Update, Delete 
function clickEvent(e){   //체크랑 삭제(Delete 기능)
    const el = e.target;
    
    let arr;
    let state = localStorage.getItem('state');
    if(state == 'Active') arr = list.filter((item) => !item.done);
    else if(state == 'Completed') arr = list.filter((item) => item.done);
    else arr = list;

    if(el.matches('.chk')){ //chk
        const idx = el.dataset.index;
        arr[idx].done = !arr[idx].done;
        
    }else if(el.matches('button')){ //del
        const idx = el.parentNode.querySelector('.chk').dataset.index;  // Q. 
        arr.splice(idx, 1);
    }
    localStorage.setItem('list', JSON.stringify(arr));
    showList(list, todoList, state);
}

//update ************************************************Edit
//=> 더블클릭하면 => input type text가 보여짐
function dblclickEvent(e){
    const el = e.target;
    const li = todoList.querySelector('li');
    const input = document.createElement("input");
    input.setAttribute('class','edit');

    if(el.matches('label')){
        console.log('label');
    }
}

todoList.addEventListener('click', clickEvent);
todoList.addEventListener('dblclick', dblclickEvent);

//체크박스
//전체 체크박스 => 체크상태 라면 done이 true, 체크를 푼다면 done이 false
function allChkEvent(e){
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
    showList(list, todoList, localStorage.getItem('state'));
}

allChk.addEventListener('click', allChkEvent);

//filters
function filterEvent(e){
    const el = e.target;
    //filters 안의 li 의 a태그들의 class 삭제
    const liA = this.querySelectorAll('li a');
    for(const a of liA){
        a.classList.remove('selected');
    }
    el.className = 'selected';
    
    if(el.textContent == 'Active'){
        localStorage.setItem('state','Active');
    }else if(el.textContent == 'Completed'){
        localStorage.setItem('state','Completed');
    }else{
        localStorage.setItem('state','All');
    }
    showList(list, todoList, localStorage.getItem('state'));
}

filters.addEventListener('click', filterEvent);

//clearCompleted  Q.....
function clearEvent(e){
    list = list.filter((item) => !item.done); //
    localStorage.removeItem('list');
    localStorage.setItem('list',JSON.stringify(list));
    showList(list, todoList, localStorage.getItem('state'));
}

clearCompleted.addEventListener('click', clearEvent);