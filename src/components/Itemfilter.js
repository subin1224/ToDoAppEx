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
        const { filterItem } = this.$props;
        this.addEvent('click', '.filters', ({ target }) => {
            /*
            let nowLink = document.location.href; //현재 주소
            let slashIdx = filterLink.lastIndexOf('/'); //마지막 / 의 위치
            let filterLink = nowLink.substr(slashIdx-1);

            let isFilter = (filterLink == document.querySelector('.filters').firstElementChild
                .getAttribute('href')) ? 0 : ((filterLink == document.querySelector('.filters')
                    .lastElementChild.getAttribute('href') ? 2 : 1));
            */
            filterItem(Number(target.dataset.isFilter));
        });
    }
}

