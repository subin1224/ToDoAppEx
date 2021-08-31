import Component from "./core/Component.js";
import Item from "./components/Item.js";
import ItemAppender from "./components/ItemAppender.js";
import Itemfilter from "./components/Itemfilter.js";

export default class App extends Component{
    setup(){
        this.$state = JSON.parse(localStorage.getItem('todoList')) || [];
    }

    template(){ 
        return `
            <header class="todo-head" aria-label="새로운 할 일 작성"></header>
            <section class="todo-main" style="display:none" aria-label="할 일 목록"></section>
            <footer class="todo-foot" style="display:none" aria-label="필터링"></footer>
        `;
    }

    mounted(){
        const { filteredItems, addItem, deleteItem, toggleItem, filterItem, allChk, 
                clearCompleted, updateItem, dragStartItem, dragEndItem, 
                dragEnterItem, dragLeaveItem, dropItem }  = this;

        const $itemAppender = this.$target.querySelector('.todo-head');
        const $items = this.$target.querySelector('.todo-main');
        const $itemFilter = this.$target.querySelector('.todo-foot');
        
        new ItemAppender($itemAppender, {
            addItem: addItem.bind(this)
        });

        if(this.$state.items){ 
            if(this.$state.items.length > 0){
                $items.style.display = 'block';
                $itemFilter.style.display = 'block';
            }

            new Item($items, {
                filteredItems,
                deleteItem: deleteItem.bind(this),
                toggleItem: toggleItem.bind(this),
                allChk: allChk.bind(this),
                updateItem: updateItem.bind(this),
                dragStartItem: dragStartItem.bind(this),
                dragEndItem: dragEndItem.bind(this),
                dragEnterItem: dragEnterItem.bind(this),
                dragLeaveItem: dragLeaveItem.bind(this),
                dropItem: dropItem.bind(this),
                isFilter : this.$state.isFilter,
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
    get filteredItems(){
        const { isFilter, items } = this.$state;
        if(items){
            return items.filter(({ done }) => ( isFilter === this._ACTIVE && !done ) ||
                ( isFilter === this._COMPLETED && done ) ||
                    isFilter === this._ALL );
        }
    }

    //추가
    addItem(contents){
        const { items } = this.$state;
        const seq = new Date().getTime();
        const done = false;
        this.setState( items ? {
            items: [
                ...items,
                { seq, contents, done }
            ]
        } : { 
            isFilter : 0,
            items: [{ seq, contents, done }] 
        });
        document.querySelector('.new-todo').focus();
    }

    //삭제
    deleteItem(seq){
        const items = [ ...this.$state.items ];
        items.splice(items.findIndex( t => t.seq === seq ), 1 );
        this.setState({ items });
    }

    //체크
    toggleItem(seq){
        const items = [ ...this.$state.items ];
        const index = items.findIndex( t => t.seq === seq );
        items[index].done = !items[index].done;
        this.setState({ items });
    }

    //필터 select 박스 클릭 이벤트
    filterItem(isFilter){
        this.setState({ isFilter });
        this.showSelectedFilter( isFilter );
    }

    //isFilter 에 따른 select 클래스 부여
    showSelectedFilter(isFilter){
        const liA = document.querySelectorAll( '.filters li a' );
        for(const a of liA){
            a.classList.remove( 'selected' );
        }
        liA[isFilter].className = 'selected';
    }

    //전체 체크박스 설정/해제
    allChk(target){
        const items = [ ...this.$state.items ];
        for(const item of items){
            item.done = ( target.checked ) ? true : false ;
        }
        this.setState({ items });
    }

    isAllChk(items){
        const $todoFoot = this.$target.querySelector('.todo-foot');
        //render 한 이후로 체크 표시 
        let chkLen = 0;
        for(const item of items){
            if( item.done ) chkLen++;
        }
         
        document.querySelector( '#allChk' ).checked = (( chkLen === items.length ) ? true : false);
        $todoFoot.firstElementChild.textContent = `${ items.length - chkLen } items left`;
        $todoFoot.lastElementChild.style.display = (( chkLen > 0 ) ? 'block' : 'none');
    }

    //체크된 부분 삭제
    clearCompleted(){
        let items = [ ...this.$state.items ];
        const clearItems = items.filter((item) => !item.done);
        items = clearItems;
        this.setState({ items });
    }

    //더블클릭 하면 수정
    updateItem(seq, contents){
        const items = [ ...this.$state.items ];
        const index = items.findIndex(t => t.seq === seq);

        if( contents.trim().length > 0 ){
            items[index].contents = contents;
        }else{
            items.splice(index, 1);
        }
        this.setState({ items });
    }  
    
    //drag 작업
    findItemForli(seq){
        const items = this.filteredItems;   //필터아이템으로 변경
        const index = items.findIndex(t => t.seq === seq);

        const item = document.querySelectorAll('.todo-list li');
        return item[index];
    }

    dragStartItem(seq){
        this.findItemForli(seq).classList.add('is-dragging');
    }

    dragEndItem(seq){
        this.findItemForli(seq).classList.remove('is-dragging');
        this.findItemForli(seq).classList.remove('guide');
    }

    dragEnterItem(seq){
        this.findItemForli(seq).classList.add('guide');
    }

    dragLeaveItem(seq){
        this.findItemForli(seq).classList.remove('guide');
    }

    dropItem(startseq, dropseq){    
        const items = [ ...this.$state.items ];
        const startidx = items.findIndex(t => t.seq === startseq);
        const endidx = items.findIndex(t => t.seq === dropseq);

        const temp = items[startidx];
        items[startidx] = items[endidx];
        items[endidx] = temp; 

        this.setState({ items });
    }
}