

import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import AddEvent from './pages/addevent/AddEvent.jsx'
import Events from './pages/events/Events.jsx'
import SearchEvent from './pages/searchEvent/SearchEvent.jsx'

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/addevent",
    element: <AddEvent />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/searchevent",
    element: <SearchEvent />,
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  );
}

export default App;