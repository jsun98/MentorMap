import React from 'react';

class NavTab extends React.Component {
  render () {
    return (
      <li>
        <a href={this.props.target}>
          <i className={this.props.tabClass}></i>
          {this.props.tabVal}
          </a>
      </li>
    );
  }
}

export default NavTab;
