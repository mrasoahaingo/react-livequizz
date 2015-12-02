import React from 'react'
import Icon from './Icon'
import { fromJS } from 'immutable'

export default class Player extends React.Component {
    componentWillReceiveProps() {
        if(this.props.getReady && !this.props.hasSendReady) {
            this.props.sendReady(this.props.player);
        }
    }
    handleBuzz (event) {
        event.preventDefault();
        this.props.buzz(this.props.player);
    }
    handleReady() {
        this.props.ready(this.props.player);
    }
    handleHello() {
        this.props.sayHello(this.props.player);
    }
    render () {
        const player = fromJS(this.props.players).find(player => player.get('player') === this.props.player);
        const isReady = player && player.get('isReady');
        const isOut = this.props.out.indexOf(this.props.player) > -1;
        const isDisabled = !isReady || this.props.quizz === null || this.props.showResponse || this.props.buzzer;

        let icon = <Icon name="gps_fixed"/>
        if (!this.props.quizz)
            icon = <Icon name="gps_not_fixed"/>
        else if (isOut)
            icon = <Icon name="gps_off"/>

        return (
            <div className="Player">
                <h1>Hello {this.props.player}</h1>
                <button className="Player__Buzzer"
                    disabled={isDisabled}
                    onTouchTap={this.handleBuzz.bind(this)}
                    onClick={this.handleBuzz.bind(this)}>
                    {icon}
                </button>
                <div className="Player__Actions">
                    <button className="Player__Icon"
                        onTouchTap={this.handleReady.bind(this)}
                        onClick={this.handleReady.bind(this)}>
                        <Icon name="thumb_up"/>
                    </button>
                    <button className="Player__Icon"
                        onTouchTap={this.handleHello.bind(this)}
                        onClick={this.handleHello.bind(this)}>
                        <Icon name="tag_faces"/>
                    </button>
                </div>
            </div>
        )
    }
}
