import { useState } from 'react';
import eventbriteService from '../services/eventbriteService';
import authService from '../services/authService';
import './style/CreateEventForm.css';

const CreateEventForm = ({ onEventCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Other',
    start_date: '',
    end_date: '',
    venue_name: '',
    venue_address: '',
    online_event: false,
    is_free: false,
    capacity: 100,
    currency: 'KES',
    image_url: '',
    tickets: [{ name: 'General', price: 0, quantity: 100 }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'image_url') {
      setImagePreview(value);
    }
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...formData.tickets];
    newTickets[index] = {
      ...newTickets[index],
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value
    };
    setFormData({ ...formData, tickets: newTickets });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('You must be logged in to create an event');
      }

      const eventData = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      const result = await eventbriteService.createEvent(eventData, token);

      setFormData({
        name: '',
        description: '',
        category: 'Other',
        start_date: '',
        end_date: '',
        venue_name: '',
        venue_address: '',
        online_event: false,
        is_free: false,
        capacity: 100,
        currency: 'KES',
        image_url: '',
        tickets: [{ name: 'General', price: 0, quantity: 100 }]
      });
      setImagePreview('');

      if (onEventCreated) {
        onEventCreated();
      }

      const ebUrl = result.event?.checkout_url || result.eventbrite_url;
      alert(
        `✅ Event created successfully!\n\n` +
        `Your event has been published on Eventbrite and is now live.\n` +
        (ebUrl ? `\nView on Eventbrite:\n${ebUrl}` : '')
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-form">
      <h2>Create New Event</h2>

      {error && (
        <div className="form-error">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Event Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="My Amazing Event"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Tell people about your event..."
          />
        </div>

        <div className="form-group">
          <label>Event Image URL</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/event-image.jpg"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date & Time *</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date & Time *</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Venue Name</label>
            <input
              type="text"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleChange}
              placeholder="Venue name"
            />
          </div>

          <div className="form-group">
            <label>Venue Address</label>
            <input
              type="text"
              name="venue_address"
              value={formData.venue_address}
              onChange={handleChange}
              placeholder="Full address"
            />
          </div>
        </div>

        <div className="form-row checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="online_event"
              checked={formData.online_event}
              onChange={handleChange}
            />
            Online Event
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_free"
              checked={formData.is_free}
              onChange={handleChange}
            />
            Free Event
          </label>
        </div>

        <div className="tickets-section">
          <h3>Tickets</h3>
          {formData.tickets.map((ticket, index) => (
            <div key={index} className="ticket-row">
              <input
                type="text"
                placeholder="Ticket name"
                value={ticket.name}
                onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
              />
              <input
                type="number"
                placeholder="Price (KES)"
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={ticket.quantity}
                onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
