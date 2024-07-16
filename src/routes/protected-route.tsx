import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // 로그인한 사용자는 protect-route를 접근 및 조회 가능
  const user = auth.currentUser;
  console.log(user);
  if (!user) {
    // 로그인 안한 유저는 login페이지로 이동...
    return <Navigate to="/login" />;
  }
  return children;
}
