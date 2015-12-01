import React from "react"
import { Motion, spring } from 'react-motion'

export default class Timer extends React.Component {
    constructor () {
        super();
        this.state = {
            count: 10
        };
    }
    componentWillReceiveProps() {
        this.startTimer();
    }
    componentWillUnMount() {
        clearTimeout(this.timeout);
    }
    startTimer() {
        this.setState({
            count: 10
        });
        this.tick();
    }
    tick () {
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({
                count: this.state.count - 1
            });
            if (this.state.count > 0) {
                this.tick();
            }
        }, 1000);
    }
    render (){
        const yPos = this.props.startCountDown ? 1 : 0;
        const springConfig = [500, 10];
        const style = {
            scale: spring(yPos)
        };
        return(
            <Motion style={style}>
                {({scale}) =>
                <div className="Timer" style={{
                        transform: `scale(${scale})`,
                        WebkitTransform: `scale(${scale})`,
                    }}>
                    {this.state.count}
                </div>
            }
        </Motion>
    )
}
}
