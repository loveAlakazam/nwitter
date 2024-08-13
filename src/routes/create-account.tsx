import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';

import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  Form,
  Input,
  Error,
  Title,
  Wrapper,
  Switcher,
} from '../components/auth-components';
import GithubButton from '../components/github-button';

// const errors = {
//   "auth/email-already-in-use": "That email already exists",
// };

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false); // 화면 로딩 X

  // 초기에 빈값으로 초기화
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 값이 변경될때 발생하는 이벤트
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    // name에 change가 일어날때마다 value값을 변경.
    if (name === 'name') {
      setName(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  // 버튼클릭 이벤트 발생할때
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password === '') {
      return;
    }
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      // go to index
      navigate('/');
    } catch (error) {
      // set error
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join nwitter</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange} // onChange 함수
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          onChange={onChange}
          type="submit"
          value={isLoading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to="/login">Login &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
