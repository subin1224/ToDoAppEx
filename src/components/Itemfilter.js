import Component from "../core/Component.js";

export default class Itemfilter extends Component {
    template () {
        return `
        <span class="todo-count"></span>
            <ul class="filters">
                <li>
                    <a href="#/" data-is-filter="0" class="selected">All</a>
                </li>
                <li>
                    <a href="#/active" data-is-filter="1">Active</a>
                </li>
                <li>
                    <a href="#/completed" data-is-filter="2">Completed</a>
                </li>
            </ul>
            <button class="clear-completed" style="display:none">Clear completed</button>
        `;
    }

    setEvent () {
        const { filterItem, clearCompleted } = this.$props;
        
        this.addEvent('click', '.filters li a', ({ target }) => {
            
            /* 주소로 필터해보는걸 생각 했었음
            let isFilter = (target.getAttribute('href') == document.querySelector('.filters li').firstElementChild
                .getAttribute('href')) ? 0 : (target.getAttribute('href') == document.querySelector('.filters')
                    .lastElementChild.firstElementChild.getAttribute('href') ? 2 : 1);
            
            filterItem(Number(isFilter));
            */
            filterItem(Number(target.dataset.isFilter));
        });

        this.addEvent('click', '.clear-completed', () => {
            clearCompleted();
        });
    }
    
}

