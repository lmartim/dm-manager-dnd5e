import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = { monsters: [] }

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(monsters => this.setState({ monsters }));
  }

  render() {
    return (
      <div className="App">
        <h1>Monsters</h1>
        {this.state.monsters.map((monster, index) =>
          <div key={index}>{monster.name}</div>
        )}
      </div>
    );
  }
}

export default App;