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
        
        this.addEvent('click', '.filters li a', function (e) {
            filterItem(Number(e.target.dataset.isFilter));
        });

        this.addEvent('click', '.clear-completed', function () {
            clearCompleted();
        });
    }
    
}

