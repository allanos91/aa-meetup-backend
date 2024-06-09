const LOAD_EVENT = "event/LOAD_EVENT"

const load = (data, type, id) => ({
    data,
    type,
    id
})

const initialState = {}

export const getEventDetails = (id) => async dispatch => {
    const response = await fetch(`/api/events/${id}`)
    const data = await response.json()
    dispatch(load(data, LOAD_EVENT, id))
    return data
}

const eventDetailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_EVENT: {
            const details = {}
            details[action.id] = action.data
            return {
                ...state,
                ...details
            }
        }
        default:
            return state
    }
}

export default eventDetailsReducer
