import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import ErrorPage from './pages/ErrorPage';
import MessagesList from './componets/MessagesList';
import Messages from './pages/Messages';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import SinglePost from './pages/SinglePost';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Home from './pages/Home';
import store  from './store/store';
import { Provider } from 'react-redux';

const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout />, errorElemennt: <ErrorPage />, children: [
      { index: true, element: <Home /> },
      { path: 'messages', element: <MessagesList /> },
      { path: 'messages/receiverId', element: <Messages /> },
      { path: 'bookmarks', element: <Bookmarks /> },
      { path: 'users/:id', element: <Profile /> },
      { path: 'users/:id', element: <SinglePost /> },
    ]},
    { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/logout', element: <Logout /> },
])    
const App = () => {

  return (
    <Provider store={store}>
    <RouterProvider router={router}/>

    </Provider>
  )
}

export default App