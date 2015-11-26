import React from 'react'
import { Iterable, Map } from 'immutable'

export default class Admin extends React.Component {
    render () {
        return (
            <div>
                <button onClick={this.props.next.bind(this)}>NEXT</button>
                <button onClick={this.props.rightResponse.bind(this)} disabled={!this.props.buzzer}>YES</button>
                <button onClick={this.props.wrongResponse.bind(this)} disabled={!this.props.buzzer}>NO</button>
                <button onClick={this.props.toggleResponse.bind(this)}>RESPONSE</button>
            </div>
        )
    }
}
