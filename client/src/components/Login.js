import React from 'react'
import Icon from './Icon'

export default class Login extends React.Component {
    setPlayerName (event) {
        event.preventDefault();
        const playerId = this.refs.playerId.value.toLowerCase();
        switch(playerId) {
            case 'francia':
            this.props.welcomeAdmin();
            break;

            case '':
            case 'guest':
            this.props.welcomeGuest();
            break;

            default:
            this.props.addPlayer(this.refs.playerId.value);
            break;
        }
    }
    render () {
        return (
            <form className="Login" onSubmit={this.setPlayerName.bind(this)}>
                <label className="Login__Icon" htmlFor="login"><Icon name="person"/></label>
                <input id="login" className="Login__Input" ref="playerId" type="text" placeholder="Pseudo" autoFocus={true}/>
            </form>
        )
    }
}
