import { useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';
import './style/EventbriteCheckoutButton.css';

const generateId = (eventbriteId, eventUrl) => {
  let hash = 0;
  const str = String(eventbriteId || eventUrl || '');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `eb-widget-${Math.abs(hash).toString(36)}`;
};

const scriptLoadStarted = new Set();
const isHttps = window.location.protocol === 'https:';

const EventbriteCheckoutButton = ({
  eventbriteId,
  eventUrl,
  isFree = false,
  className = '',
  onRequireAuth
}) => {
  const triggerId = useMemo(() => generateId(eventbriteId, eventUrl), [eventbriteId, eventUrl]);

  const handleOrderComplete = useCallback(() => {
    alert('🎉 Ticket purchase successful! Check your email for confirmation.');
  }, []);

  useEffect(() => {
    if (!eventbriteId || !isHttps) return;

    const createWidget = () => {
      if (!window.EBWidgets) return;
      try {
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: eventbriteId,
          modal: true,
          modalTriggerElementId: triggerId,
          onOrderComplete: handleOrderComplete
        });
      } catch (error) {
        console.error('Error creating Eventbrite widget:', error);
      }
    };

    if (window.EBWidgets) {
      createWidget();
      return;
    }

    if (scriptLoadStarted.has(eventbriteId)) return;
    scriptLoadStarted.add(eventbriteId);

    const script = document.createElement('script');
    script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
    script.async = true;
    script.onload = createWidget;
    script.onerror = () => console.error('Failed to load Eventbrite widget script');
    document.body.appendChild(script);
  }, [eventbriteId, handleOrderComplete, triggerId]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!authService.isAuthenticated()) {
      onRequireAuth({ eventbriteId, eventUrl, isFree });
      return;
    }

    if (isHttps && eventbriteId) {
      return;
    }

    if (eventUrl) {
      window.open(eventUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Checkout is not available for this event');
    }
  };

  return (
    <button
      id={triggerId}
      className={`eventbrite-checkout-btn ${className}`}
      onClick={handleClick}
      type="button"
    >
      {isFree ? '🎟️ Register Free' : '🎫 Buy Tickets'}
    </button>
  );
};

export default EventbriteCheckoutButton;
