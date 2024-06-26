import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';
import groupsReducer from './groups';
import groupEventsReducer from './groupevents';
import groupDetailsReducer from './groupdetails';
import eventsReducer from './events';
import eventDetailsReducer from './eventdetails';
import groupImagesReducer from './groupimages';
import eventImageReducer from './eventimages';

const rootReducer = combineReducers({
  session: sessionReducer,
  groups: groupsReducer,
  groupEvents: groupEventsReducer,
  groupDetails: groupDetailsReducer,
  events: eventsReducer,
  eventDetails: eventDetailsReducer,
  groupImages: groupImagesReducer,
  eventImages: eventImageReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };





  export default configureStore;
