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

        const addByEnter = function(e){
            if(e.key !== 'Enter') return;
            //e.target.parent.removeEventListener('blur', addByBlur);
            if(e.target.value.trim().length > 0) addItem(e.target.value);
        }

        const addByBlur = function(e){
            console.log('blur !!! ');
            if(e.target.value.trim().length > 0) addItem(e.target.value);
        }

        this.addEvent('keyup', '.new-todo', addByEnter);

        //Issue
        //this.addEvent('blur', '.new-todo', addByBlur, true);
    }
}
