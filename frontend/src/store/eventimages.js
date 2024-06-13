import { csrfFetch } from './csrf'

const POST_EVENT_IMG = "event/POST_IMAGE"

const post = (data, id) => ({
    type: POST_EVENT_IMG,
    data,
    id
})

const initialState = {}

export const postImageEvent = (data, eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const img = await response.json()
        dispatch(post(img, eventId))
        return img
    }
}

const eventImageReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_EVENT_IMG: {
            if (!state.eventImages) {
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
        default: {
            return state
        }
    }
}

export default eventImageReducer
