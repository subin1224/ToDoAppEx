import Component from "./core/Component.js";
import Item from "./components/Item.js";
import ItemAppender from "./components/ItemAppender.js";
import Itemfilter from "./components/Itemfilter.js";

export default class App extends Component{
    setup () {
        this.$state = { 
            isFilter: 0, 
            items: [
                {
                  seq: 1,
                  contents: 'item1',
                  done: false,
                },
                {
                  seq: 2,
                  contents: 'item2',
                  done: true,
                }
              ]
        };
    }

    template () {   //여기서 에러 . . .  2번 조건식 여기서 먼갈 해야하는데 ..
        return `
            <header class="todo-head" aria-label="새로운 할 일 작성"></header>
            <section class="todo-main" style="display:none" aria-label="할 일 목록"></section>
            <footer class="todo-foot" aria-label="필터링"></footer>
        `;
    }

    mounted () {
        const { filteredItems, addItem, deleteItem, toggleItem, filterItem }  = this;
        const $itemAppender = this.$target.querySelector('.todo-head');
        const $items = this.$target.querySelector('.todo-main');
        const $itemFilter = this.$target.querySelector('.todo-foot');
        
        new ItemAppender($itemAppender, {
            addItem: addItem.bind(this)
        });

  
        new Item($items, {
            filteredItems,
            deleteItem: deleteItem.bind(this),
            toggleItem: toggleItem.bind(this),
        });

        $items.style.display = 'block';

        new Itemfilter($itemFilter, {
            filterItem: filterItem.bind(this)
        });
        
    
    }

    
    get filteredItems () {
        const { isFilter, items } = this.$state;
        if(items.length > 0 ){
            return items.filter(({ done }) => (isFilter === 1 && !done) ||
                (isFilter === 2 && done) ||
                    isFilter === 0);
        }
    }

    addItem (contents) {
        const { items } = this.$state;
        const seq = new Date().getTime();
        const done = false;
        this.setState({
            items: [
                ...items,
                {seq, contents, done}
            ]
        });
        document.querySelector('.new-todo').focus();
    }

    deleteItem (seq) {
        const items = [ ...this.$state.items ];
        items.splice(items.findIndex( t => t.seq === seq), 1);
        this.setState({items});
    }

    toggleItem (seq) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);
        items[index].done = !items[index].done;
        this.setState({items});
    }

    filterItem (isFilter) {
        this.setState({ isFilter });

        const filters = document.querySelector('.filters');
        const liA = filters.querySelectorAll('li a');
        for(const a of liA){
            a.classList.remove('selected');
        }
    
        liA[isFilter].className = 'selected';

    }

}