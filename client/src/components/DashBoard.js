import React from 'react'
import { fromJS } from 'immutable'
import { Motion, spring } from 'react-motion'
import classNames from 'classnames'
import Timer from "./Timer"
import Icon from './Icon'

const scoreItemHeight = 35;

export default class DashBoard extends React.Component {
    buildScoreList (players) {
        const orderedPlayersByScore = players
            .sort((a, b) => (a.get('score') < b.get('score')))
            .map(player => player.get('name'));

        return players.map(player => {
            const yPos = orderedPlayersByScore.indexOf(player.get('name')) * scoreItemHeight;
            const springConfig = [300, 50];
            const motionStyle = {
                y: spring(yPos, springConfig),
                name: player.get('name'),
                score: player.get('score')
            };
            const listClassName = classNames(
                'Scores__Item',
                'Score', {
                    'Scores__Item--Selected': this.props.buzzer === player.get('name'),
                    'Scores__Item--Disabled': player.get('isOut'),
                    'Scores__Item--Ready': player.get('isReady')
                }
            );
            const icon = player.get('isReady') ? <Icon name="check" className="Score__Check"/> : '';
            return (
                <Motion style={motionStyle} key={player.get('name')}>
                    {({y, name, score}) =>
                        <li className={listClassName} style={{
                                transform: `translateY(${y}px)`,
                                WebkitTransform: `translateY(${y}px)`,
                            }} data-score={score}>
                            {icon}
                            {name}
                        </li>
                    }
                </Motion>
            )
        });
    }
    render () {
        const players = fromJS(this.props.players);
        const scoreList = this.buildScoreList(players);
        const showQuestion = players.count(player => player.get('isReady')) === players.size;
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
                        <h2 className="Quizz__Question">
                            {this.props.quizz && showQuestion? this.props.quizz.question : <Icon name="thumb_up" className="Dashboard__Icon"/> }
                        </h2>
                        <h3 className="Quizz__Response">
                            {this.props.quizz && this.props.showResponse ? this.props.quizz.response : ''}
                        </h3>
                    </div>
                </div>
            </div>
        );
    }
}
