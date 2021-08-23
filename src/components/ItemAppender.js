import Component from "../core/Component.js";

export default class ItemAppender extends Component{
    template () {
        return `
        <input type="text" class="new-todo" placeholder="What needs to be done?" autofocus/>
        `;
    }

    setEvent () {
        const { addItem } = this.$props;

        //왜 blur이벤트는 발생이 안되는거지ㅠㅠ
        this.addEvent('blur', '.new-todo', ((e) => {
            if(e.target.value.length > 0) addItem(e.target.value);
        }));
        
        //엔터키 누르면 focusout 까지 이벤트가 두번 먹힘
        this.addEvent('keyup', '.new-todo', ({ key, target }) => {
            if (key !== 'Enter' || target.value.length <= 0) return;
            addItem(target.value);
        });
      
    }
}