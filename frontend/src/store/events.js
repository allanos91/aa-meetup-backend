import  { csrfFetch }   from "./csrf"

const LOAD_EVENTS = "events/LOAD_EVENTS"
const POST_EVENT = "event/POST_EVENT"

const load = (data, type, id) => ({
    data,
    type,
    id
})

const post = (data) => ({
    data,
    type: POST_EVENT
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
        default:
            return state;
    }
}

export default eventsReducer
