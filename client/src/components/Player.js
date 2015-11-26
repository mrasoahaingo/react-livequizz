import React from 'react'

export default class Player extends React.Component {
    handleBuzz (event) {
        event.preventDefault();
        this.props.buzz(this.props.player);
    }
    render () {
        return (
            <h1>
                Hello {this.props.player}
                {this.props.quizz ?
                    <button disabled={this.props.buzzer && this.props.buzzer !== this.props.player}
                    onClick={this.handleBuzz.bind(this)}>BUZZ</button> : ''}
            </h1>
        )
    }
}
