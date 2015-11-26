import React from 'react'
import { Map } from 'immutable'

export default class Admin extends React.Component {
    handleNext (event) {
        event.preventDefault();
        this.props.next();
    }
    handleRightResponse (event) {
        event.preventDefault();
        this.props.rightResponse();
    }
    handleShowResponse (event) {
        event.preventDefault();
        this.props.rightResponse();
    }
    handleWrongResponse (event) {
        event.preventDefault();
        this.props.wrongResponse();
    }
    render () {
        let scores = [];
        for(var player in this.props.scores) {
            scores.push(<li key={player}>
                {player}: {this.props.scores[player]}
                {this.props.buzzer === player ? ' <' : ''}
                {this.props.out.indexOf(player) > -1 ? ' out': ''}
            </li>)
        }
        return (
            <div>
                <h2>Question (total: {this.props.entries.length}) {this.props.quizz ? this.props.quizz.question : ''}</h2>
                <h3>Reponse {this.props.quizz && this.props.showResponse ? this.props.quizz.response : ''}</h3>
                <button onClick={this.handleNext.bind(this)}>NEXT</button>
                <button onClick={this.handleRightResponse.bind(this)} disabled={!this.props.buzzer}>YES</button>
                <button onClick={this.handleWrongResponse.bind(this)} disabled={!this.props.buzzer}>NO</button>
                <button onClick={this.handleShowResponse.bind(this)}>RESPONSE</button>
                <h2>Scores</h2>
                <ul>{scores}</ul>
            </div>
        )
    }
}
