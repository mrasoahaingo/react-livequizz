import React from 'react'
import { fromJS } from 'immutable'
import { Motion, spring } from 'react-motion'
import classNames from 'classnames'
import Timer from "./Timer"

const scoreItemHeight = 35;

export default class DashBoard extends React.Component {
    render () {
        const players = fromJS(this.props.players);

        const orderedPlayersByScore = players
            .sort((a, b) => (a.get('score') < b.get('score')))
            .map(player => player.get('player'));

        const scoreList = players.map(player => {
            const yPos = orderedPlayersByScore.indexOf(player.get('player')) * scoreItemHeight;
            const springConfig = [300, 50];
            const motionStyle = {
                y: spring(yPos, springConfig),
                player: player.get('player'),
                score: player.get('score')
            };
            const listClassName = classNames(
                'Scores__Item', {
                    'Scores__Item--Selected': this.props.buzzer === player.get('player'),
                    'Scores__Item--Disabled': this.props.out.indexOf(player.get('player')) > -1,
                    'Scores__Item--Ready': player.get('isReady')
                }
            );
            return (
                <Motion style={motionStyle} key={player.get('player')}>
                    {({y, player, score}) =>
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
                    <ul className="Scores" style={{ height: players.size * scoreItemHeight }}>
                        {scoreList}
                    </ul>
                </div>
                <div className="Dashboard__Quizz">
                    <Timer startCountDown={this.props.startCountDown}/>
                    <div className="Quizz">
                        <h2 className="Quizz__Question">{this.props.quizz ? this.props.quizz.question : ''}</h2>
                        <h3 className="Quizz__Response">{this.props.quizz && this.props.showResponse ? this.props.quizz.response : ''}</h3>
                    </div>
                </div>
            </div>
        )
    }
}
