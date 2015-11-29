import React from 'react'
import Icon from './Icon'

export default class Player extends React.Component {
    handleBuzz (event) {
        event.preventDefault();
        this.props.buzz(this.props.player);
    }
    render () {

        const isOut = this.props.out.indexOf(this.props.player) > -1
        const isDisabled = this.props.quizz === null || this.props.showResponse || this.props.buzzer
        let icon = <Icon name="gps_fixed"/>
        if (this.props.quizz === null)
            icon = <Icon name="gps_not_fixed"/>
        else if (isOut)
            icon = <Icon name="gps_off"/>
        return (
            <div className="Player">
                <h1>Hello {this.props.player}</h1>
                <button className="Player__Buzzer"
                    disabled={isDisabled}
                    onClick={this.handleBuzz.bind(this)}>
                    {icon}
                </button>
            </div>
        )
    }
}
