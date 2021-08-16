/*
로컬스토리지 저장을 어떻게 할지 ...
idx 추가해서, task 저장하기에는
delete 할때 좀 문제가 생길것 같고 ..
어떤것이 Active / complete 되었는지도 상태도 있어야 하고..
=> 객체 저장
*/

//로컬 스토리지에 있는 todo들 혹은 맨 처음의 빈 배열
const list =JSON.parse(localStorage.getItem('list')) || [];
const insert = document.querySelector('.new-todo');
const todoList = document.querySelector('.todo-list');

showList(list, todoList);

//Create
//기존 todoApp에서는 Alt나 Tab 눌러도 등록 되었으나 Enter만 등록되게 수정
//기존 todoApp은 focusOut(?) 이용 했을거라 추측 .....
insert.addEventListener("keyup", (e)=>{
    if(e.key === "Enter" && insert.value.length > 0){
        const task = insert.value;
        const item = {
            task,
            done : false
        };
        list.push(item);
        showList(list, todoList);
        localStorage.setItem('list',JSON.stringify(list));

        insert.value="";
        insert.focus();
    }
});

//innerHTML 보단 textContent 권장사항인데, 각종 요소들이 필요해서
//createElement 작성해서 textNode로 작성을 하였는데
//이와 같이 요소들이 많은 경우에는 createElement 보다는 innerHTML이 더 낫다고..
//이와 관련된 부분 학습해서 수정 혹은 보완
function addList(task){
    const li = document.createElement('li');

    const div = document.createElement('div');
    div.setAttribute('class','task');

    li.appendChild(div);

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class','chk');

    const label = document.createElement('label');

    const btn = document.createElement('button');
    btn.setAttribute('class', 'del');

    const item = document.createTextNode(task);
    label.appendChild(item);

    div.append(input, label, btn);

    todoList.appendChild(li);
}


//Read
//로컬스토리지 학습 -> list.length >0 이면 todo-foot 나오게 변경
function showList(list = [], todoList){
    todoList.innerHTML = list.map((item, i) => {
        return `
        <li class="${item.done ? 'completed' : ''}">
            <div class="task">
                <input type="checkbox" class="chk" data-index=${i} id="item${i}" 
                    ${item.done ? 'checked' : ''} />
                <label >${item.task}</label>
                <button class="del"></button>
            </div>
        </li>
        `;
    }).join(''); //join 쓰는 이유?
}




//Update
//dbClick 메서드 만들어야 함

//체크박스에 이벤트
//왜 요소 첫번째만 반영이 되는거지 ... ㅠㅠ
/*
querySelectorAll, for...of 학습!  => addEventListenr 로 해결
const chk = document.querySelectorAll('.chk');
for(const updateChk of chk){
    updateChk.addEventListener('click', (e)=>{
        const el = e.target;
        const idx = el.dataset.index;
        list[idx].done = !list[idx].done;
        localStorage.setItem('items', JSON.stringify(list));
        showList(list, todoList);
    });
}
*/

function chkEvent(e){
    if(!e.target.matches('input')) return;
    const el = e.target;
    const idx = el.dataset.index;
    list[idx].done = !list[idx].done;
    localStorage.setItem('list', JSON.stringify(list));
    showList(list, todoList);
}

todoList.addEventListener('click', chkEvent);


//Delete

