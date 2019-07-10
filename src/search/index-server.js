const React = require('react');

class Search extends React.Component {

    constructor() {
        super(...arguments);
    }

    render() {
        return <div className="search-text">
            搜索文字的内容
        </div>;
    }
}

// CJS

module.exports = <Search />;