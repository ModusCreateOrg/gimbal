import React from 'react';
import withNavigationGuard from '../../components/withNavigationGuard';
import logo from './logo.svg';
import './index.css';

const IndexPage: React.FC = () => (
  <div className="Index">
    <header className="Index-header">
      <img src={logo} className="Index-logo" alt="logo" />
      <p>
        Edit <code>src/page/Index/index.tsx</code> and save to reload.
      </p>
      <a className="Index-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>
    </header>
  </div>
);

export default withNavigationGuard({ redirectPath: '/login' })(IndexPage);
