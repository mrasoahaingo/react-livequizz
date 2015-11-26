import React from 'react'
import { connect } from 'react-redux';

import * as actions from '../actions';
import Admin from './Admin'
import Login from './Login'
import Player from './Player'
import Winner from './Winner'
import DashBoard from './DashBoard'

export class App extends React.Component {
    render () {
        if (this.props.winner) {
            return <Winner {...this.props}/>
        }
        if (this.props.isAdmin) {
            return <Admin {...this.props}/>
        }
        if (this.props.isGuest) {
            return <DashBoard {...this.props}/>
        }
        if (this.props.player) {
            return <Player {...this.props}/>
        }
        return <Login {...this.props}/>;
    }
}

App.defaultProps = {
    players: []
}

function mapStateToProps(state) {
    return state.toJS();
}

export const AppContainer = connect(mapStateToProps, actions)(App);
