import React from 'react'

export default class Winner extends React.Component {
    render () {
        return (
            <div className="Winner">
                <h1>{this.props.winner} wins!!!!!!!</h1>
            </div>
        )
    }
}
