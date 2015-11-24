'use strict';

var Competitions = require('./components/CompetitionsTable');
var Leaderboard = require('./components/Leaderboard');
var Link = require('react-router').Link;
var React = require('react');
var Route = require('react-router').Route;
var Router = require('react-router').Router;

if(document.getElementById('Competitions')) {
    React.render(
        <Competitions url={'http://leaderboard-project.azurewebsites.net/api/competition'}/>, document.getElementById('Competitions')
    );
}

if(document.getElementById('Leaderboard')) {
    React.render(
        <Leaderboard
            url={'http://leaderboard-project.azurewebsites.net/api/competition/dogs-vs-cats/leaderboard'}
            activeUser={'DaggerFS'}/>,
            document.getElementById('Leaderboard')
    );
}
