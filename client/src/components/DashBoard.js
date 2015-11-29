import React from 'react'
import { fromJS } from 'immutable'
import { Motion, spring } from 'react-motion'
import classNames from 'classnames'

const springConfig = [300, 50];
const scoreItemHeight = 35;

export default class DashBoard extends React.Component {
    render () {
        const playerScores = fromJS(this.props.scores);
        const orderedPlayer = playerScores.sortBy(score => score.get('score')).reverse().map(player => player.get('player'));
        const scores = playerScores.map((playerScore, i) => {
            const style = {
                y: spring(orderedPlayer.indexOf(playerScore.get('player')) * scoreItemHeight, springConfig),
                player: playerScore.get('player'),
                score: playerScore.get('score')
            };
            const listClassName = classNames(
                'Scores__Item', {
                    'Scores__Item--Selected': this.props.buzzer === playerScore.get('player'),
                    'Scores__Item--Disabled': this.props.out.indexOf(playerScore.get('player')) > -1
                }
            );
            return (
                <Motion style={style} key={i}>
                    {
                        ({y, player, score}) =>
                        <li className={listClassName} style={{
                                transform: `translateY(${y}px)`,
                                WebkitTransform: `translateY(${y}px)`,
                            }} data-score={score}>
                            {player}
                        </li>
                    }
                </Motion>
            )
        });

        return (
            <div className="Dashboard">
                <div className="Dashboard__Scores">
                    <ul className="Scores" style={{ height: playerScores.size * scoreItemHeight }}>{scores}</ul>
                </div>
                <div className="Dashboard__Quizz">
                    <div className="Quizz">
                        <h2 className="Quizz__Question">{this.props.quizz ? this.props.quizz.question : ''}</h2>
                        <h3 className="Quizz__Response">{this.props.quizz && this.props.showResponse ? this.props.quizz.response : ''}</h3>
                    </div>
                </div>
            </div>
        )
    }
}
