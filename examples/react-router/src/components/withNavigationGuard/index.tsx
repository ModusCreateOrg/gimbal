import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSession } from '../../service/session';

interface Props {
  redirectPath: string;
}

const withNavigationGuard = ({ redirectPath }: Props) => (Component: React.FC) => (props: {}) => {
  const session = useSession();

  if (!session.initialized) {
    return null;
  }

  if (!session.loggedIn) {
    return <Redirect to={redirectPath} />;
  }

  return <Component {...props} />;
};

export default withNavigationGuard;
