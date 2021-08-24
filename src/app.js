import Component from "./core/Component.js";
import Item from "./components/Item.js";
import ItemAppender from "./components/ItemAppender.js";
import Itemfilter from "./components/Itemfilter.js";

export default class App extends Component{
    setup () {
        this.$state = { //나중에 로컬 작업 할 부분
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

    template () { 
        return `
            <header class="todo-head" aria-label="새로운 할 일 작성"></header>
            <section class="todo-main" style="display:none" aria-label="할 일 목록"></section>
            <footer class="todo-foot" style="display:none" aria-label="필터링"></footer>
        `;
    }

    mounted () {
        const { filteredItems, addItem, deleteItem, toggleItem, filterItem, allChk, clearCompleted, updateItem }  = this;
        const $itemAppender = this.$target.querySelector('.todo-head');
        const $items = this.$target.querySelector('.todo-main');
        const $itemFilter = this.$target.querySelector('.todo-foot');
        
        new ItemAppender($itemAppender, {
            addItem: addItem.bind(this)
        });
        
        if(filteredItems){  //task들이 있을때 todo-main과 todo-foot 작업 진행
            $items.style.display = 'block';
            $itemFilter.style.display = 'block';
    
            new Item($items, {
                filteredItems,
                deleteItem: deleteItem.bind(this),
                toggleItem: toggleItem.bind(this),
                allChk: allChk.bind(this),
                updateItem: updateItem.bind(this),
            });
            
            new Itemfilter($itemFilter, {
                filterItem: filterItem.bind(this),
                clearCompleted: clearCompleted.bind(this),
            });

            this.isAllChk(this.$state.items);
        }
    }

    //필터된 task들을 가져옴
    get filteredItems () {  
        const { isFilter, items } = this.$state;
        if(items.length > 0 ){
            return items.filter(({ done }) => (isFilter === 1 && !done) ||
                (isFilter === 2 && done) ||
                    isFilter === 0);
        }
    }

    //추가
    addItem (contents) {    //item 추가 -> 후에 여기서 로컬스토리지 작업 예상
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

    //삭제
    deleteItem (seq) {
        const items = [ ...this.$state.items ];
        items.splice(items.findIndex( t => t.seq === seq), 1);
        this.setState({items});
    }

    //체크
    toggleItem (seq) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);
        items[index].done = !items[index].done;
        this.setState({items});
    }

    //필터 select 박스 -> 후에 로컬스토리지 작업 예상
    filterItem (isFilter) {
        this.setState({ isFilter });

        const liA = document.querySelectorAll('.filters li a');
        //const liA = filters.querySelectorAll('li a');
        for(const a of liA){
            a.classList.remove('selected');
        }
        
        liA[isFilter].className = 'selected';
    }

    ////////////////////////////////////////// 여기부터는 .... 3번 .... 
    
    //전체 체크박스 설정/해제
    allChk (target) {
        const items = [ ...this.$state.items ];
        //전체 체크 설정 및 해제
        if(target.checked){
            for(const item of items){
                item.done = true;
            }
        }else{
            for(const item of items){
                item.done = false;
            }
        }
        this.setState({items});
    }

    //렌더 이후의 작업 setState XX 
    //전체가 체크 상태라면 전체체크 되게, 아니라면 해제 &&& 
    //todo-count 에 textContent
    isAllChk (items) {
        const $todoFoot = this.$target.querySelector('.todo-foot');

        //render 한 이후로 체크 표시 
        let chkLen = 0;
        for(const item of items){
            if(item.done) chkLen++;
        }
         
        document.querySelector('#allChk').checked = ((chkLen === items.length) ? true : false);
        $todoFoot.firstElementChild.textContent = `${items.length - chkLen} items left`;
        $todoFoot.lastElementChild.style.display = ((chkLen > 0 ) ? 'block' : 'none' );
    }

    //체크된 부분 삭제
    clearCompleted () {
        let items = [ ...this.$state.items ];
        const clearItems = items.filter((item) => !item.done);
        items = clearItems;
        this.setState({items});
    }

    //더블클릭 하면 수정
    updateItem (seq, contents) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);

        if(contents.trim().length > 0){
            items[index].contents = contents;
        }else{
            items.splice(index, 1);
        }

        this.setState({items});

    }
}