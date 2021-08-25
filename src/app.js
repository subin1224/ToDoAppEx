import Component from "./core/Component.js";
import Item from "./components/Item.js";
import ItemAppender from "./components/ItemAppender.js";
import Itemfilter from "./components/Itemfilter.js";

export default class App extends Component{
    setup () {
        this.$state = JSON.parse(localStorage.getItem('todoList')) || [];
    }

    template () { 
        return `
            <header class="todo-head" aria-label="새로운 할 일 작성"></header>
            <section class="todo-main" style="display:none" aria-label="할 일 목록"></section>
            <footer class="todo-foot" style="display:none" aria-label="필터링"></footer>
        `;
    }

    mounted () {
        const { filteredItems, addItem, deleteItem, toggleItem, filterItem, allChk, 
                clearCompleted, updateItem, dragStartItem, dragEndItem, dragOverItem,
                dragEnterItem, dragLeaveItem, dropItem }  = this;
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
                dragStartItem: dragStartItem.bind(this),
                dragEndItem: dragEndItem.bind(this),
                dragOverItem: dragOverItem.bind(this),
                dragEnterItem: dragEnterItem.bind(this),
                dragLeaveItem: dragLeaveItem.bind(this),
                dropItem: dropItem.bind(this),
            });
            
            new Itemfilter($itemFilter, {
                filterItem: filterItem.bind(this),
                clearCompleted: clearCompleted.bind(this),
            });

            this.isAllChk(this.$state.items);
            this.showSelectedFilter(this.$state.isFilter);
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

    //필터 select 박스 클릭 이벤트
    filterItem (isFilter) {
        this.setState({ isFilter });

        this.showSelectedFilter(isFilter);
    }

    ////////////////////////////////////////// 여기부터는 .... 3번 .... 
    //isFilter 에 따른 select 클래스 부여
    showSelectedFilter (isFilter) {
        const liA = document.querySelectorAll('.filters li a');
        for(const a of liA){
            a.classList.remove('selected');
        }
        
        liA[isFilter].className = 'selected';
    }

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

    //드래그 -> 클래스 추가
    dragStartItem (seq) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);

        const item = document.querySelectorAll('.todo-list li');
        item[index].classList.add('is-dragging');
    }

    dragEndItem (seq) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);

        const item = document.querySelectorAll('.todo-list li');
        item[index].classList.remove('is-dragging');
    }

    dragOverItem (event) {
        event.preventDefault();
    }

    dragEnterItem (seq) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);

        const item = document.querySelectorAll('.todo-list li');
        item[index].classList.add('guide');
    }

    dragLeaveItem (seq) {
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);

        const item = document.querySelectorAll('.todo-list li');
        item[index].classList.remove('guide');
    }

    dropItem (seq) {    
        //dragLeaveItem(seq);
        //deleteItem(seq);

    }
}