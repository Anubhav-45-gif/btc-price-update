import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import CryptoDetails from './components/CryptoDetails';

const App = () => (
  <div >
      <Switch>
        <Route exact path="/">
          <CryptoDetails />
        </Route>
      </Switch>
  </div>
);

export default App;
