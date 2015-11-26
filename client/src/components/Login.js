import React from 'react'

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
            <form>
            <input ref="playerId" type="text"/>
            <button onClick={this.setPlayerName.bind(this)}>go</button>
            </form>
        )
    }
}
