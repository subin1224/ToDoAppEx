import Component from "../core/Component.js";

export default class Item extends Component {
    template () {
        const { filteredItems } = this.$props;

        //
        const $allChk = document.createElement('input');

        
        return `    
            <input type="checkbox" class="allChk" id="allChk">
            <label for="allChk"></label>

            <ul class="todo-list">
            ${filteredItems.map(({contents, done, seq}) => `
                <li draggable="true" data-seq=${seq} ${done ? 'class="completed"' : ''}>
                    <div class="task">
                        <input type="checkbox" class="chk" data-seq=${seq}
                            ${done ? 'checked' : ''} />
                        <label>${contents}</label>
                        <button class="del"></button>
                    </div>
                </li>
            `).join('')}
            </ul>
        `;    

    }

    setEvent () {
        const { deleteItem, toggleItem, allChk, updateItem, 
            dragStartItem, dragEndItem, dragEnterItem,
            dragLeaveItem, dropItem } = this.$props;
        
        //삭제
        this.addEvent('click', '.del', ({target}) => {
            deleteItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        //체크
        this.addEvent('click', '.chk', ({target}) => {
            toggleItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        //전체 체크
        this.addEvent('click', '.allChk', ({target}) => {
            allChk(target);
        });

        //수정
        this.addEvent('dblclick', '.task label', ({target}) => {
            //const el = e.target;

            const _updateInput = document.createElement("input");
            _updateInput.className = 'edit';
            _updateInput.value = target.textContent;
            target.parentNode.after(_updateInput);

            target.closest('li').className = 'editing';
            _updateInput.focus();
            
            //_updateInput.addEventListener('blur', updateItem(Number(target.closest('[data-seq]').dataset.seq), _updateInput.value)); 
            
            //_updateInput에 Event 추가 => 후에 수정할 것 !!
            _updateInput.addEventListener('keyup', (e) => {
                if(e.keyCode === 13) updateItem(Number(target.closest('[data-seq]').dataset.seq), _updateInput.value);
            });
            
        });

        //드래그 작업
        /*
            이동할 요소에 draggable="true" 추가 할것
            드래그 한 엘리먼트가 드랍 될 영역은 event.preventDefault() 추가
            -해당 스타일 정의 할 것 - 
            드래그 될 때의 스타일 => is-dragging class 추가
            드래그가 다른 엘리먼트 위에 있을 때 스타일 => guide 추가
            다른 엘리먼트 위에 드랍 될 때의 스타일 => 모든 드래그 관련 클래스 삭제
        */
        //dragstart, dragEnd, dropItem, dragover, dragenter, dragleave
        this.addEvent('dragstart', '.todo-list li', ({target}) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('data-seq', target.closest('[data-seq]').dataset.seq);

            dragStartItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        this.addEvent('dragend', '.todo-list li', ({target}) => {
            dragEndItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        this.addEvent('dragover', '.todo-list li', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
            return false;
        });

        this.addEvent('dragenter', '.todo-list li', ({target}) => {
            dragEnterItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        this.addEvent('dragleave', '.todo-list li', ({target}) => {
            event.stopPropagation();
            dragLeaveItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        this.addEvent('drop', '.todo-list li', ({target}) => {
            //드래그 시작한 seq, 드랍 한 seq
            dropItem(Number(event.dataTransfer.getData('data-seq')) ,Number(target.closest('[data-seq]').dataset.seq));
        });

    }
}