import { useState } from 'react';
import Nav from '../../share/components/Nav.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SearchEvent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSearch(event) {
    event.preventDefault();
    setIsSearching(true);
    setErrorMessage('');
    setHasSearched(false);

    try {
      const response = await fetch(
        `${API_URL}/events?search=${encodeURIComponent(searchTerm.trim())}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Could not search for events.');
      }

      setEvents(result.data);
      setHasSearched(true);
    } catch (error) {
      setErrorMessage(error.message || 'Could not connect to the server.');
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <main>
      <Nav />
      <h1>Search for events</h1>
      <p>Enter an event title, date, or venue to find an event.</p>
      <form onSubmit={handleSearch}>
        <label htmlFor="event-search">Search events</label>
        <input
          id="event-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Title, date, or venue"
          required
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {errorMessage && <p role="alert">{errorMessage}</p>}
      {hasSearched && events.length === 0 && <p>No events found.</p>}
      {hasSearched && events.length > 0 && (
        <section aria-label="Search results">
          <h2>Search results</h2>
          {events.map((event, index) => (
            <article key={event.id || index}>
              <h3>{event.title}</h3>
              <p>Date: {event.date}</p>
              <p>Venue: {event.venue}</p>
              <p>Total seats: {event.totalSeats ?? event.totalseats}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default SearchEvent;

