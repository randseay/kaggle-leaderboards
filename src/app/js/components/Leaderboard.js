var React = require('react');
var Table = require('reactable').Table;

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
        return (
            <Table
                className='table'
                data={this.state.data}
                sortable={true} />
        );
    }
});

module.exports = Leaderboard;
