//로컬 스토리지에 있는 todo들 혹은 맨 처음의 빈 배열
const list =JSON.parse(localStorage.getItem('list')) || [];

const insert = document.querySelector('.new-todo');

const todoList = document.querySelector('.todo-list');
const todoMain = document.querySelector('.todo-main');
const todoFoot = document.querySelector('.todo-foot');

const filters = document.querySelector('.filters');

//Create
const insertEvent = (e) => {
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
insert.addEventListener('blur',insertEvent);
insert.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13) insertEvent(this);
});

//Read
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

//로컬스토리지 학습 -> list.length >0 이면 todo-foot 나오게 변경
//map() 활용
const showList = (list = [], todoList, state) => {
    if(list.length > 0){
        todoMain.style.display = 'block';

        let arr;
        if(state == 'Active') arr = list.filter((item) => !item.done);
        else if(state == 'Completed') arr = list.filter((item) => item.done);
        else arr = list;
        
        todoList.innerHTML = arr.map((item, i) => {
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
        }).join(''); //join을 안쓰면 빈 공백이 생김

        //목록 중 체크가 하나라도 풀리면 전체 체크박스 자동 해제, 
        //모든 목록이 다 체크 되었으면 전체 체크 박스 설정
        let chkLen = 0;
        for(const item of list){
            if(item.done) chkLen++;
        }

        if(chkLen == list.length) todoMain.firstElementChild.checked = true;
        else todoMain.firstElementChild.checked = false;

        const todoCnt = todoFoot.querySelector('.todo-count');
        todoCnt.textContent = `${list.length - chkLen} items left`;

        if(chkLen > 0) todoFoot.lastElementChild.style.display = 'block';
        else todoFoot.lastElementChild.style.display = 'none';

        selectState(localStorage.getItem('state'));
    }else{
        todoMain.style.display = 'none';
        localStorage.setItem('state','All'); ///////////////
    }
    
}

showList(list, todoList, localStorage.getItem('state'));

//Update, Delete 
const clickEvent = (e) => { //체크랑 삭제(Delete 기능)
    const el = e.target;

    if(!el.matches('.chk') && !el.matches('button')) return;

    let arr;
    let state = localStorage.getItem('state');
    if(state == 'Active') arr = JSON.parse(localStorage.getItem('list')).filter((item) => !item.done);
    else if(state == 'Completed') arr = JSON.parse(localStorage.getItem('list')).filter((item) => item.done);
    else arr = JSON.parse(localStorage.getItem('list'));

    if(el.matches('.chk')){ //chk
        const idx = el.dataset.index;
        arr[idx].done = !arr[idx].done;
        localStorage.setItem('list', JSON.stringify(arr));
        
    }else if(el.matches('button')){ //del
        const id = el.closest('li').id;
        const idx = list.findIndex((item) => {
            return id == item.id;
        });
 
        list.splice(idx, 1);
        localStorage.setItem('list', JSON.stringify(list));
    }

    showList(JSON.parse(localStorage.getItem('list')), todoList, state);
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
        const idx = list.findIndex((item) => {
            return id == item.id;
        });
        list.splice(idx,1);
    }

    localStorage.setItem('list',JSON.stringify(list));
    showList(JSON.parse(localStorage.getItem('list')), todoList, localStorage.getItem('state'));
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
    showList(JSON.parse(localStorage.getItem('list')), todoList, localStorage.getItem('state'));
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
        localStorage.setItem('state','Completed');
    }else{
        localStorage.setItem('state','All');
    }
    showList(JSON.parse(localStorage.getItem('list')), todoList, localStorage.getItem('state'));
}

filters.addEventListener('click', filterEvent);

//clearCompleted  Q..... /////////////////////////
const clearEvent = (e) => {
    //list = list.filter((item) => !item.done); //
    const arr = JSON.parse(localStorage.getItem('list')).filter((item) => !item.done);
    //localStorage.removeItem('list');
    localStorage.setItem('list',JSON.stringify(arr));
    showList(JSON.parse(localStorage.getItem('list')), todoList, localStorage.getItem('state'));
}


todoFoot.lastElementChild.addEventListener('click', clearEvent);
