import React, { Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Provider from './service/session';

const About = React.lazy(() => import('./page/About'));
const Index = React.lazy(() => import('./page/Index'));
const Login = React.lazy(() => import('./page/Login'));

const App: React.FC = () => (
  <Provider>
    <Router>
      <div>
        <Header />

        <Switch>
          <Suspense fallback={<div>Failed to load</div>}>
            <Route exact path="/about">
              <About />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Index />
            </Route>

            <Route component={() => <Redirect to="/login" />} />
          </Suspense>
        </Switch>
      </div>
    </Router>
  </Provider>
);

export default App;
