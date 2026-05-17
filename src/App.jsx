import { useState, useRef, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import SearchHero from './components/SearchHero';
import EventGrid from './components/EventGrid';
import Footer from './components/Footer';
import { Loader, ErrorState, EmptyState } from './components/StateViews';
import CreateEventForm from './components/CreateEventForm';
import EventDetails from './components/EventDetails';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import SavedEventsView from './components/SavedEventsView';
import MyEventsView from './components/MyEventsView';
import authService from './services/authService';
import { useEvents } from './hooks/useEvents';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('all-events');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSource, setActiveSource] = useState('all');
  const [pendingEvent, setPendingEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const createFormRef = useRef(null);
  const eventsRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSourceChange = (source) => {
    setActiveSource(source);
    if (eventsRef.current) {
      eventsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const { events, loading, error, total, refetch } = useEvents(debouncedSearch, activeSource);

  useEffect(() => {
    if (currentView === 'create' && createFormRef.current) {
      createFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentView]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentView('all-events');
    setTimeout(() => {
      eventsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEventCreated = () => {
    setCurrentView('all-events');
    refetch();
    showToast('Event created successfully!', 'success');
  };

  const handleEventClick = (event) => {
    if (!authService.isAuthenticated()) {
      setPendingEvent(event);
      setShowAuthModal(true);
    } else {
      setSelectedEvent(event);
    }
  };

  const handleCheckoutAuth = (checkoutInfo) => {
    if (!authService.isAuthenticated()) {
      setPendingEvent(checkoutInfo);
      setShowAuthModal(true);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  const handleCreateEventClick = () => {
    if (!authService.isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    setCurrentView('create');
  };

  const handleMyEventsClick = () => {
    setCurrentView('my-events');
  };

  const handleSavedEventsClick = () => {
    setCurrentView('saved-events');
  };

  const handleBackToAllEvents = () => {
    setCurrentView('all-events');
    refetch();
  };

  return (
    <div className="app">
      <NavBar 
        onCreateEventClick={handleCreateEventClick}
        onMyEventsClick={handleMyEventsClick}
        onSavedEventsClick={handleSavedEventsClick}
        activeSource={activeSource}
        onSourceChange={handleSourceChange}
        onLogout={() => showToast('Logged out successfully', 'info')}
        onAuthSuccess={(action) => showToast(action === 'login' ? 'Welcome back!' : 'Account created successfully!', 'success')}
      />

      {currentView === 'all-events' && (
        <SearchHero onSearch={handleSearch} />
      )}

      <main className="main-content">
        {/* Create Event View */}
        {currentView === 'create' && authService.isAuthenticated() && (
          <div ref={createFormRef}>
            <CreateEventForm
              onEventCreated={handleEventCreated}
              onCancel={handleBackToAllEvents}
            />
          </div>
        )}

        {/* My Events View */}
        {currentView === 'my-events' && (
          <MyEventsView 
            onEventClick={handleEventClick}
            onClose={handleBackToAllEvents}
          />
        )}

        {/* Saved Events View */}
        {currentView === 'saved-events' && (
          <SavedEventsView 
            onEventClick={handleEventClick}
            onClose={handleBackToAllEvents}
          />
        )}

        {/* All Events View */}
        {currentView === 'all-events' && (
          <div ref={eventsRef}>
            <div className="events-controls">
              {!loading && !error && events.length > 0 && (
                <div className="results-header">
                  <h2>{total} Events Found</h2>
                </div>
              )}
            </div>

            {loading && <Loader />}

            {error && (
              <ErrorState
                message={error}
                onRetry={refetch}
              />
            )}

            {!loading && !error && events.length === 0 && (
              <EmptyState
                message="No events found. Try a different search or create your first event!"
              />
            )}

            {!loading && !error && events.length > 0 && (
              <EventGrid
                events={events}
                onEventClick={handleEventClick}
                onSaveToggle={refetch}
                onToast={showToast}
                onCheckoutAuth={handleCheckoutAuth}
              />
            )}
          </div>
        )}
      </main>

      {selectedEvent && (
        <EventDetails
          eventId={selectedEvent.id}
          eventSource={selectedEvent.source}
          eventData={selectedEvent.source !== 'local' ? selectedEvent : null}
          onClose={handleCloseDetails}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setPendingEvent(null);
          }}
          onSuccess={() => {
            setShowAuthModal(false);
            window.dispatchEvent(new CustomEvent('auth-change'));
            showToast('Welcome back!', 'success');
            if (pendingEvent) {
              if (pendingEvent.eventbriteId) {
                if (pendingEvent.eventUrl) {
                  window.open(pendingEvent.eventUrl, '_blank', 'noopener,noreferrer');
                }
              } else {
                setSelectedEvent(pendingEvent);
              }
              setPendingEvent(null);
            } else {
              setCurrentView('create');
              setTimeout(() => {
                createFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }
          }}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
