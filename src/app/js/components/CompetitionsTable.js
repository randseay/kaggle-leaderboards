var Link = require('react-router').Link;
var React = require('react');
var Table = require('reactable').Table;
var Td = require('reactable').Td;
var Th = require('reactable').Th;
var Thead = require('reactable').Thead;
var Tr = require('reactable').Tr;
var unsafe = require('reactable').unsafe;

var COLUMNS = [
    {key: 'CompetitionName', label: 'Competition'}
];

var Leaderboard = React.createClass({
    getInitialState: function() {
    return {data: []};
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
    render: function() {
        var activeUser = this.props.activeUser;
        return (
            <div>
                <h1 className='primary-text'>
                    Kaggle <small>Competitions</small>
                </h1>

                <hr />

                <Table
                    columns={COLUMNS}
                    sortable={true}
                    noDataText='No Data Found.'>

                    {this.state.data.map(function(row) {
                        return (
                            <Tr key={row.Id}>
                                <Td column='CompetitionName'>
                                    <Link to={'/competition/' + row.CompetitionName}>{row.CompetitionName}</Link>
                                </Td>
                            </Tr>
                        )
                    })}
                </Table>
            </div>
        );
    }
});

module.exports = Leaderboard;
