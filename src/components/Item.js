import Component from "../core/Component.js";

export default class Item extends Component {
    template () {
        const { filteredItems } = this.$props;

        return `    
            <input type="checkbox" class="allChk" id="allChk">
            <label for="allChk"></label>

            <ul class="todo-list" draggable="true">
            ${filteredItems.map(({contents, done, seq}) => `
                <li data-seq=${seq} ${done ? 'class="completed"' : ''}>
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
        const { deleteItem, toggleItem, allChk, updateItem } = this.$props;
        
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

            const updateInput = document.createElement("input");
            updateInput.className = 'edit';
            updateInput.value = target.textContent;
            target.parentNode.after(updateInput);

            target.closest('li').className = 'editing';
            updateInput.focus();
            
            //updateInput.addEventListener('blur', updateItem(Number(target.closest('[data-seq]').dataset.seq), updateInput.value)); 
            
            updateInput.addEventListener('keyup', (e) => {
                if(e.keyCode === 13) updateItem(Number(target.closest('[data-seq]').dataset.seq), updateInput.value);
            });

        });
    }
}