import React from 'react'
import Icon from './Icon'
import { fromJS } from 'immutable'

export default class Player extends React.Component {
    componentWillReceiveProps() {
        if(this.props.getReady && !this.props.hasSendReady) {
            this.props.sendReady(this.props.playerName);
        }
    }
    handleBuzz (event) {
        event.preventDefault();
        this.props.buzz(this.props.playerName);
    }
    handleReady() {
        this.props.ready(this.props.playerName);
    }
    handleHello() {
        this.props.sayHello(this.props.playerName);
    }
    render () {
        const player = fromJS(this.props.players).find(player => player.get('name') === this.props.playerName);
        const isReady = player.get('isReady');
        const isOut = player.get('isOut');
        const isDisabled = isOut || !isReady || !this.props.quizz || this.props.showResponse || this.props.buzzer;

        let icon = <Icon name="gps_fixed"/>
        if (!this.props.quizz)
            icon = <Icon name="gps_not_fixed"/>
        else if (isOut)
            icon = <Icon name="gps_off"/>

        return (
            <div className="Player">
                <h1>Hello {this.props.playerName}</h1>
                <button className="Player__Buzzer"
                    disabled={isDisabled}
                    onTouchTap={this.handleBuzz.bind(this)}
                    onClick={this.handleBuzz.bind(this)}>
                    {icon}
                </button>
                <div className="Player__Actions">
                    <button className="Player__Icon"
                        disabled={isReady}
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
