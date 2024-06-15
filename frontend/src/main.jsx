import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { restoreCSRF, csrfFetch} from './store/csrf'
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal'
import { NumEventsProvider } from './context/NumUpEvents';
import { NumPastEventsProvider } from './context/PastEvents';
import { EventHeaderProvider } from './context/EventHeader';
import { IsDeletedProvider } from './context/IsDeleted';

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions; // <-- ADD THIS LINE
}



if (import.meta.env.MODE !== 'production') {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
}

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <NumEventsProvider>
          <NumPastEventsProvider>
            <EventHeaderProvider>
              <IsDeletedProvider>
                <App />
                <Modal />
              </IsDeletedProvider>
            </EventHeaderProvider>
          </NumPastEventsProvider>
        </NumEventsProvider>
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
