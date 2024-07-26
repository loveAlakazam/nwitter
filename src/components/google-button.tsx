import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { styled } from "styled-components";

const Button = styled.span`
  background-color: white;
  margin-top: 10px;
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

export default function GoogleButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/google-logo.svg"></Logo>
      Continue with Google
    </Button>
  );
}
