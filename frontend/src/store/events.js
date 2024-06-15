import  { csrfFetch }   from "./csrf"

const LOAD_EVENTS = "events/LOAD_EVENTS"
const POST_EVENT = "event/POST_EVENT"
const DELETE_EVENT = "event/DELETE_EVENT"
const REFRESH_EVENTS = "events/REFRESH"

const load = (data, type, id) => ({
    data,
    type,
    id
})

const post = (data) => ({
    data,
    type: POST_EVENT
})

const remove = (eventId) => ({
    eventId,
    type: DELETE_EVENT
})

const refresh = (data) => ({
    data,
    type: REFRESH_EVENTS
})

const initialState = {}

export const getEvents = () => async dispatch => {
    const response = await fetch('/api/events')
    const data = await response.json()
    dispatch(load(data, LOAD_EVENTS))
    return data
}

export const postEvent = (data, groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const event = await response.json()
        dispatch(post(event))
        return event
    }
}

export const removeEvent = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        const res = await response.json()
        dispatch(remove(eventId))
        return res
    }
}

export const refreshEvents = () => async dispatch => {
    const response = await csrfFetch(`/api/events`)
    const data = await response.json()
    dispatch(refresh(data))
    return data
}

const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_EVENTS: {
            const newEvents = {}
            action.data.Events.forEach(event => {
                newEvents[event.id] = event
            })
            return {
                ...state,
                ...newEvents
            }
        }
        case POST_EVENT: {
            if (!state.events) {
                state[action.data.id] = action.data
                const newState = {
                    ...state
                }
                return newState
            }
            state[action.data.id] = action.data
            return {
                ...state
            }
        }
        case DELETE_EVENT: {
            delete state[action.eventId]
            return {
                ...state
            }
        }
        case REFRESH_EVENTS: {
            const newEvents = {}
            action.data.Events.forEach(event => {
                newEvents[event.id] = event
            })
            return {
                ...newEvents
            }
        }
        default:
            return state;
    }
}

export default eventsReducer
