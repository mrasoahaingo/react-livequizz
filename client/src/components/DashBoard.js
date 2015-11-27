import React from 'react'
import { fromJS } from 'immutable'
import { Motion, spring } from 'react-motion'

const springConfig = [300, 50];

export default class DashBoard extends React.Component {
    render () {
        const playerScores = fromJS(this.props.scores);
        const orderedPlayer = playerScores.sort((a, b) => (a.get('score') < b.get('score'))).map(player => player.get('player'));
        const scores = playerScores.map((playerScore, i) => {
            const style = {
                y: spring(orderedPlayer.indexOf(playerScore.get('player')) * 20, springConfig),
                player: playerScore.get('player'),
                score: playerScore.get('score')
            };
            return (
                <Motion style={style} key={i}>
                {({y, player, score}) =>
                    <li style={{
                        position: 'absolute',
                        top: '50%',
                        transform: `translateY(${y}px)`,
                        WebkitTransform: `translateY(${y}px)`,
                    }}>
                        {player}: {score}
                        {this.props.buzzer === player ? ' <' : ''}
                        {this.props.out.indexOf(player) > -1 ? ' out': ''}
                    </li>
                }
                </Motion>
            )
        });

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
