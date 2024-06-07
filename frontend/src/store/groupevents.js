const LOAD_GROUP_EVENTS = "groups/LOAD_GROUP_EVENTS"

const load = (data, type, id) => ({
    type,
    data,
    id
})

const initialState = {}

export const getEventsFromGroup = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}/events`)
    const data = await response.json();
    // console.log('flag2', data)
    dispatch(load(data, LOAD_GROUP_EVENTS, id))
    return response
}

const groupEventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUP_EVENTS: {
            const groupEvents = {}
            const group = []

            action.data.Events.forEach(event => {
                group.push(event)
            })
            groupEvents[action.id] = group
            return {
                ...state,
                ...groupEvents
            }
        }
        default:
            return state
    }
}

export default groupEventsReducer
