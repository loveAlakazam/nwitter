import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Title, Wrapper, Error, Switcher } from "../components/auth-components";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPasswords() {
  const [isLoading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // 값이 변경될때 발생하는 이벤트
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    }
  };

  // 사용자에게 비밀번호재설정 이메일 보내기
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Reset your passwords</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          type="submit"
          value={isLoading ? "Loading..." : "Find your Passwords"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}

      <Switcher>
        Do you have your account <Link to="/login">Log in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
