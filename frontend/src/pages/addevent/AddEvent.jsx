import { useState } from 'react';
import Nav from '../../share/components/Nav.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AddEvent() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    totalSeats: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalSeats: Number(formData.totalSeats),
        }),
      });
      const result = await response.json();

      setMessage(result.msg || 'Event added successfully.');
      setFormData({
        title: '',
        date: '',
        venue: '',
        totalSeats: '',
      });
    } catch (submitError) {
      setMessage(submitError.message || 'Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <Nav />
      <section>
        <h1>Add an event</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <div>
            <label>
              Date
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Venue
            <input
              name="venue"
              type="text"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Total seats
            <input
              name="totalSeats"
              type="number"
              min="1"
              step="1"
              value={formData.totalSeats}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding event…' : 'Add event'}
          </button>
          {message && (
            <p role="status">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default AddEvent;
