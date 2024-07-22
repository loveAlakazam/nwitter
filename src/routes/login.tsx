import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Form, Input, Error, Title, Wrapper, Switcher } from "./auth-components";

const errors = {
  "auth/email-already-in-use": "That email already exists",
};

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false); // 화면 로딩 X
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 값이 변경될때 발생하는 이벤트
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "password") {
      setPassword(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  // 버튼클릭 이벤트 발생할때
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      // go to index
      navigate("/");
    } catch (e) {
      // set error
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log into nwitter</Title>
      <Form onSubmit={onSubmit}>
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
        <Input onChange={onChange} type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
