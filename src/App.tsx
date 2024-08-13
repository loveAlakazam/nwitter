import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LayOut from './components/layout';
import Home from './routes/home';
import Profile from './routes/profile';
import CreateAccount from './routes/create-account';
import Login from './routes/login';
import { styled, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loading-screen';
import { auth } from './firebase';
import ProtectedRoute from './routes/protected-route';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <LayOut />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/create-account',
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
${reset};
* {
  box-sizing: border-box
}
body {
  background-color: black;
  color: white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);

  const init = async () => {
    // wait for firebase
    await auth.authStateReady();
    // setTimeout(() => setLoading(false), 2000);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  // loading중이면 LoadingScreen을 랜더링한다.
  // loading완료되면 router을 랜더링한다.
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
