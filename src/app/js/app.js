'use strict';

var Competitions = require('./components/CompetitionsTable');
var Leaderboard = require('./components/Leaderboard');
var React = require('react');

React.render(
    <Leaderboard url={'http://leaderboard-project.azurewebsites.net/api/competition/dogs-vs-cats/leaderboard'} activeUser={'DaggerFS'}/>, document.getElementById('Leaderboard')
);
