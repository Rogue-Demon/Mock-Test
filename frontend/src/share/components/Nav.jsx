import { Link } from 'react-router-dom'

function Nav() {
  return (
    <div>
        <Link to="/">Home</Link>
        <Link to="/addevent">Add Event</Link>
        <Link to="/events">View Events</Link>
        <Link to="/searchevent">Search Event</Link>
    </div>
  )
}

export default Nav