export default class Component {
    $target;
    $props; //부모 컴포넌트가 자식 ㅓㅁ포넌트에게 상태 혹은 메소드를 넘겨주기 위해
    $state;

    constructor ($target, $props) {
        this.$target = $target;
        this.$props = $props;
        this.setup();
        this.setEvent();
        this.render();
    }

    setup () {}
    mounted () {}   //render 이후에 추가적인 기능을 수행하기 위해
    template () { return '';}
    render () {
        this.$target.innerHTML = this.template();
        this.mounted();
    }
    setEvent () {}
    setState (newState) {
        this.$state = { ...this.$state, ...newState };
        this.render();
        //localStorage.setItem('todoList', JSON.stringify(this.$state));
    };

    addEvent (eventType, selector, callback) {
        const children = [ ...this.$target.querySelectorAll(selector) ];
        const isTarget = (target) => children.includes(target) || target.closest(selector);
       
        this.$target.addEventListener(eventType, event => {
            if(!isTarget(event.target)) return false;
            callback(event);
        });
    }

    removeEvent (eventType, callback) {
        this.$target.removeEventListener(eventType, callback);
    }

}