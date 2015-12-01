var Link = require('react-router').Link;
var React = require('react');
var Table = require('reactable').Table;
var Td = require('reactable').Td;
var Th = require('reactable').Th;
var Thead = require('reactable').Thead;
var Tr = require('reactable').Tr;

var COLUMNS = [
    {key: 'Rank', label: 'Rank'},
    {key: 'TeamName', label: 'Team'},
    {key: 'NumSubmissions', label: 'Submissions'},
    {key: 'Score', label: 'Score'}
];

var Leaderboard = React.createClass({
    getInitialState: function() {
        return {
            data: []
        };
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick: function() {
        var data = this.state.data;
        var teamFound = false;

        for (var i=0; i<data.length; i++) {
            if (data[i].TeamName == this.props.activeUser) {
                data[i].NumSubmissions++;
                this.setState({data: data});
                return;
            }
        }

        if (!teamFound) {
            data.push({
                Rank: 12345,
                TeamName: this.props.activeUser,
                Users: '',
                Score: 12345.0,
                DateSubmitted: '2015-10-08T22:23:10',
                NumSubmissions: 1
            });
            this.setState({data: data});
        }
    },
    render: function() {
        var activeUser = this.props.activeUser;
        return (
            <div>
                <h1 className='primary-text'>
                    {this.props.competitionName}
                    <small> Leaderboard</small>
                </h1>

                <hr />

                <Link id='to-competitions' to='/' className='button'>
                    <i className='fa fa-arrow-left'></i> Back to competitions
                </Link>

                <a
                    id='new-submission'
                    className='button secondary small'
                    onClick={this.handleClick}>
                    <i className='fa fa-plus'></i> Add new submission
                </a>

                <Table
                    columns={COLUMNS}
                    sortable={true}
                    noDataText='No Data Found.'
                    itemsPerPage={25}
                    pageButtonLimit={5}>

                    {this.state.data.map(function(row) {
                        return (
                            <Tr key={row.Rank} className={row.TeamName == activeUser ? 'active' : ''}>
                                <Td column="Rank">{row.Rank}</Td>
                                <Td column="TeamName">
                                    {row.Users.length > 1 ? row.Users.map(function(user){return  ' ' + user.UserName;}) : row.TeamName}
                                </Td>
                                <Td column="NumSubmissions">{row.NumSubmissions}</Td>
                                <Td column="Score">{row.Score}</Td>
                            </Tr>
                        )
                    })}
                </Table>
            </div>
        );
    }
});

module.exports = Leaderboard;
