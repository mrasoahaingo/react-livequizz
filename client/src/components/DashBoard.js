import React from 'react'

export default class DashBoard extends React.Component {
    render () {
        let scores = [];
        for(var player in this.props.scores) {
            let score = this.props.scores[player];
            scores.push(<li key={player}>
                {player}: {score}
                {this.props.buzzer === player ? ' <' : ''}
                {this.props.out.indexOf(player) > -1 ? ' out': ''}
            </li>)
        }
        return (
            <div>
                <h2>Question (total: {this.props.entries.length}) {this.props.quizz ? this.props.quizz.question : ''}</h2>
                <h3>Response {this.props.quizz && this.props.showResponse ? this.props.quizz.response : ''}</h3>
                <h2>Scores</h2>
                <ul>{scores}</ul>
            </div>
        )
    }
}
