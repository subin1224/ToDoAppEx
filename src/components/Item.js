import Component from "../core/Component.js";

export default class Item extends Component {
    template () {
        const { filteredItems } = this.$props;

        return `    
            <input type="checkbox" class="allChk" id="allChk">
            <label for="allChk"></label>

            <ul class="todo-list">
            ${ filteredItems.map(( {contents, done, seq} ) => `
                <li draggable="true" data-seq=${ seq } ${ done ? 'class="completed"' : '' }>
                    <div class="task">
                        <input type="checkbox" class="chk" data-seq=${ seq }
                            ${ done ? 'checked' : '' } />
                        <label>${ contents }</label>
                        <button class="del"></button>
                    </div>
                </li>
            `).join('') }
            </ul>
        `;    
    }

    setEvent () {
        const { deleteItem, toggleItem, allChk, updateItem, 
            dragStartItem, dragEndItem, dragEnterItem,
            dragLeaveItem, dropItem, isFilter } = this.$props;
        
        //삭제
        this.addEvent ('click', '.del', function (e) {
            deleteItem(Number(e.target.closest('[data-seq]').dataset.seq));
        });

        //체크
        this.addEvent ('click', '.chk', function (e) {
            toggleItem(Number(e.target.closest('[data-seq]').dataset.seq));
        });

        //전체 체크
        this.addEvent ('click', '.allChk', function (e) {
            allChk(e.target);
        });

        //수정
        this.addEvent ('dblclick', '.task label', function (e) {
            const $updateInput = document.createElement("input");
            $updateInput.className = 'edit';
            $updateInput.value = e.target.textContent;
            e.target.parentNode.after($updateInput);

            e.target.closest('li').className = 'editing';
            $updateInput.focus();
            
            $updateInput.addEventListener('blur', function (e) {
                updateItem(Number(e.target.closest('[data-seq]').dataset.seq), $updateInput.value);
            }); 
            
            $updateInput.addEventListener('keyup', (e) => {
                if(e.keyCode === 13) updateItem(Number(e.target.closest('[data-seq]').dataset.seq), $updateInput.value);
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

        if( isFilter === 0 ){
            this.addEvent ('dragstart', '.todo-list li', function (e) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('data-seq', e.target.closest('[data-seq]').dataset.seq);
    
                dragStartItem (Number(e.target.closest('[data-seq]').dataset.seq));
            });
    
            this.addEvent ('dragend', '.todo-list li', function (e) {
                dragEndItem (Number(e.target.closest('[data-seq]').dataset.seq));
            });
    
            this.addEvent ('dragover', '.todo-list li', function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
    
            this.addEvent ('dragenter', '.todo-list li', function (e) {
                dragEnterItem (Number(e.target.closest('[data-seq]').dataset.seq));
            });
    
            this.addEvent ('dragleave', '.todo-list li', function (e) {
                e.stopPropagation();
                e.preventDefault();
                dragLeaveItem (Number(e.target.closest('[data-seq]').dataset.seq));
            });
    
            this.addEvent('drop', '.todo-list li', function (e) {
                //드래그 시작한 seq, 드랍 한 seq
                dropItem (Number(e.dataTransfer.getData('data-seq')) ,Number(e.target.closest('[data-seq]').dataset.seq));
            });
        }

    }
}
