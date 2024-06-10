import { useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation'
import * as sessionActions from './store/session';
import LandingPage from './components/LandingPage/LandingPage';
import AllGroups from './components/AllGroups/AllGroups';
import GroupDetails from './components/GroupDetails/GroupDetails';
import EventDetails from './components/EventDetails/EventDetails'

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <>
    <Navigation isLoaded={isLoaded}/>
    {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <LandingPage/>
      },
      {
        path: '/groups',
        element: <AllGroups/>
      },
      {
        path: '/groups/:groupId/details',
        element: <GroupDetails/>
      },
      {
        path: '/events/:eventId/details/:groupId',
        element: <EventDetails/>
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
