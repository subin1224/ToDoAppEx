import Component from "../core/Component.js";

export default class ItemAppender extends Component{
    template () {
        return `
        <input type="text" class="new-todo" placeholder="What needs to be done?" autofocus/>
        `;
    }

    setEvent () {
        //공백이면 add 못하게
        const { addItem } = this.$props;
 
        this.addEvent ('keyup', '.new-todo', function ({ key,target }) {
            if(key !== 'Enter') return;
            if(target.value.trim().length > 0) addItem(target.value);
        });
        
        //Issue
        this.addEvent ('blur', '.new-todo', function (e) {
            if(e.target.value.trim().length > 0) addItem(e.target.value);
        });
    }
}
