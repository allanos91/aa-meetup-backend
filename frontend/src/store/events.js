const LOAD_EVENTS = "events/LOAD_EVENTS"

const load = (data, type, id) => ({
    data,
    type,
    id
})

const initialState = {}

export const getEvents = () => async dispatch => {
    const response = await fetch('/api/events')
    const data = await response.json()
    dispatch(load(data, LOAD_EVENTS))
    return data
}

const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_EVENTS: {
            const events = action.data
            return {
                ...state,
                ...events
            }
        }
        default:
            return state;
    }
}

export default eventsReducer
