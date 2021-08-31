export default class Component {
    $target;
    $props; //부모 컴포넌트가 자식 컴포넌트에게 상태 혹은 메소드를 넘겨주기 위해
    $state;

    //isFilter 에 대한 상수 처리
    _ACTIVE = 1;
    _COMPLETED = 2;
    _ALL = 0;

    constructor($target, $props){
        this.$target = $target;
        this.$props = $props;
        this.setup();
        this.setEvent();
        this.render();
    }

    setup(){}
    mounted(){}   //render 이후에 추가적인 기능을 수행하기 위해
    template(){ return '';}
    render(){
        this.$target.innerHTML = this.template();
        this.mounted();
    }
    setEvent(){}
    setState(newState){
        this.$state = { ...this.$state, ...newState };
        this.render();
        localStorage.setItem('todoList', JSON.stringify(this.$state));
    };

    //이벤트 버블링 추상화 => 이벤트 버블링을 통한 등록 과정을 메서드로 만듦
    // selector에 명시한 것 보다 더 하위 요소가 선택되는 경우가 있을 땐
    // closest를 이용하여 처리
    addEvent(eventType, selector, callback, useCapture = false){
        const children = [ ...this.$target.querySelectorAll(selector) ];
        const isTarget = (target) => children.includes(target) || target.closest(selector);

        //console.log(this.$target); 모든 이벤트가 걸린 dom들이 가져와짐
        //따라서 해당 DOM에 addEventListener 걸건데, selector 에 맞는 애들만을 찾아서 거는것
        this.$target.addEventListener(eventType, function(e){
            if(!isTarget(e.target)) return false;
            callback(e);
        }, useCapture);
    }

}
