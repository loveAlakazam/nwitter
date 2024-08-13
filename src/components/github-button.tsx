import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { styled } from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.span`
  background-color: white;
  margin-top: 30px;
  color: black;
  font-weight: 600;
  padding: 7.5px 20px;
  border-radius: 50px;
  width: 100%;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg"></Logo>
      Continue with Github
    </Button>
  );
}
