import React from 'react'
import { Iterable, Map } from 'immutable'
import Icon from './Icon'

export default class Admin extends React.Component {
    render () {
        return (

            <div className="Admin">

                <div>
                    {this.props.quizz.response}
                </div>

                <div >
                    <button className="Admin__Next" disabled={this.props.buzzer} onClick={this.props.next.bind(this)}>
                        <Icon name="slideshow" /></button>
                </div>
                <div>
                    <button className="Admin__Action"
                        onClick={this.props.rightResponse.bind(this)} disabled={!this.props.buzzer}>
                        <Icon name="check" /></button>
                    <button className="Admin__Action"
                        onClick={this.props.toggleResponse.bind(this)}>
                        <Icon name="info_outline" /></button>
                    <button className="Admin__Action"
                        onClick={this.props.wrongResponse.bind(this)} disabled={!this.props.buzzer}>
                        <Icon name="close" /></button>
                </div>
            </div>
        )
    }
}
