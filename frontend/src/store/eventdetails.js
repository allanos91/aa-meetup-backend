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
    console.log(data)
    dispatch(load(data, LOAD_EVENT, id))
    return data
}

const eventDetailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_EVENT: {
            const eventDetails = action.data

        }
    }
}
