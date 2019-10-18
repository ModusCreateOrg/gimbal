import React from 'react';
import withNavigationGuard from '../../components/withNavigationGuard';

const AboutPage: React.FC = () => <div>this is the about page!</div>;

export default withNavigationGuard({ redirectPath: '/login' })(AboutPage);
