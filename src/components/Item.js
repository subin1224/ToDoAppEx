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
        const { deleteItem, toggleItem } = this.$props;

        this.addEvent('click', '.del', ({target}) => {
            deleteItem(Number(target.closest('[data-seq]').dataset.seq));
        });

        this.addEvent('click', '.chk', ({target}) => {
            toggleItem(Number(target.closest('[data-seq]').dataset.seq));
        });
    }
}