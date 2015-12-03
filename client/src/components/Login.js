import React from 'react'
import Icon from './Icon'

export default class Login extends React.Component {
    setPlayerName (event) {
        event.preventDefault();
        const playerName = this.refs.playerName.value.toLowerCase();
        switch(playerName) {
            case 'francia':
            this.props.welcomeAdmin();
            break;

            case '':
            case 'guest':
            this.props.welcomeGuest();
            break;

            default:
            this.props.addPlayer(playerName);
            break;
        }
    }
    render () {
        return (
            <form className="Login" onSubmit={this.setPlayerName.bind(this)}>
                <label className="Login__Icon" htmlFor="login"><Icon name="person"/></label>
                <input id="login" className="Login__Input" ref="playerName" type="text" placeholder="Your name" autoFocus={true}/>
            </form>
        )
    }
}
