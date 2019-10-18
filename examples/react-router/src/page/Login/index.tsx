import React from 'react';
import useForm from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { useSession } from '../../service/session';
import './index.css';

interface FormValues {
  password: string;
  username: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<FormValues>();
  const { dispatch, loggedIn } = useSession();

  const onSubmit = React.useCallback(
    (data: FormValues): void => {
      if (dispatch) {
        dispatch({
          type: 'login',
          data,
        });
      }
    },
    [dispatch],
  );

  if (loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <form className="Login-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        <div>Username</div>
        <input name="username" ref={register({ required: true })} />
        {errors.username && <div>Username is required.</div>}
      </label>

      <label>
        <div>Password</div>
        <input name="password" type="password" ref={register({ required: true })} />
        {errors.password && <div>Password is required.</div>}
      </label>

      <div>
        <input type="submit" />
      </div>
    </form>
  );
};

export default LoginPage;
