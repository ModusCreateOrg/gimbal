import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../../service/session';

const Header = () => {
  const { dispatch, initialized, loggedIn } = useSession();

  const onLogout = React.useCallback(() => {
    if (dispatch) {
      dispatch({
        type: 'logout',
      });
    }
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Index</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      {loggedIn && <button onClick={onLogout}>Logout</button>}
    </nav>
  );
};

export default Header;
