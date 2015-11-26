import React from 'react'

export default class Login extends React.Component {
    setPlayerName (event) {
        event.preventDefault();
        const playerId = this.refs.playerId.value;
        switch(playerId) {
            case '30ansFrancia':
            this.props.welcomeAdmin();
            break;

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
