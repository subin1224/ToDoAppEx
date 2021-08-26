export default class Component {
    $target;
    $props; //부모 컴포넌트가 자식 컴포넌트에게 상태 혹은 메소드를 넘겨주기 위해
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
        //this.$target.appendChild( this.template() );
        this.mounted();
    }
    setEvent () {}
    setState (newState) {
        this.$state = { ...this.$state, ...newState };
        this.render();
        localStorage.setItem('todoList', JSON.stringify(this.$state));
    };

    //이벤트 버블링 추상화 => 이벤트 버블링을 통한 등록 과정을 메서드로 만듦
    // selector에 명시한 것 보다 더 하위 요소가 선택되는 경우가 있을 땐
    // closest를 이용하여 처리
    addEvent (eventType, selector, callback) {
        const children = [ ...this.$target.querySelectorAll(selector) ];
        const isTarget = (target) => children.includes(target) || target.closest(selector);
       
        this.$target.addEventListener(eventType, event => {
            if(!isTarget(event.target)) return false;
            if(eventType === 'dragover'){
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
            } 
            callback(event);
        });
    }

    removeEvent (eventType, callback) {
        this.$target.removeEventListener(eventType, callback);
    }

}