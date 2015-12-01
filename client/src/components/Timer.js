import React from "react"
import { Motion, spring } from 'react-motion'

export default class Timer extends React.Component {
    constructor () {
        super();
        this.state = {
            count: 30
        };
    }
    componentDidMount() {
        this.tick();
    }
    componentDidUpdate() {
        if (this.props.startCountDown) {
            this.tick();
        } else {
            this.setState({
                count: 30
            });
        }
    }
    componentWillUnmount () {
        clearTimeout(this.timeout);
    }
    tick () {
        this.timer && clearTimeout(this.timer);
        this.timeout = setTimeout(() => {
            if (!this.props.startCountDown || this.state.count <= 0) {
                return;
            }
            this.setState({
                count: this.state.count - 1
            });
        }, 1000);
    }
    render (){
        const yPos = this.props.startCountDown ? 1 : 0;
        const springConfig = [400, 20];
        const style = {
            scale: spring(yPos, springConfig)
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
