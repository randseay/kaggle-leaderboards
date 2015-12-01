'use strict';

var Competitions = require('./components/CompetitionsTable');
var IndexRoute = require('react-router').IndexRoute;
var Leaderboard = require('./components/Leaderboard');
var Link = require('react-router').Link;
var React = require('react');
var Route = require('react-router').Route;
var Router = require('react-router').Router;

var apiBase = 'http://leaderboard-project.azurewebsites.net/api/';
var activeUser = 'DaggerFS';

var App = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

var CompetitionsHandler = React.createClass({
    render: function() {
        return (
            <Competitions url={apiBase + 'competition'}/>
        );
    }
});

var LeaderboardHandler = React.createClass({
    render: function() {
        return (
            <Leaderboard
                url={apiBase + 'competition/' + this.props.params.competitionName + '/leaderboard'}
                competitionName={this.props.params.competitionName}
                activeUser={activeUser}/>
        );
    }
});

React.render((
    <Router>
        <Route path='/' component={App}>
            <IndexRoute component={CompetitionsHandler} />
            <Route path='competition/:competitionName' component={LeaderboardHandler} />
        </Route>
    </Router>
), document.getElementById('App'));
