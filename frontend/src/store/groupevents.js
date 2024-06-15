const LOAD_GROUP_EVENTS = "groups/LOAD_GROUP_EVENTS"
const DELETE_EVENT = "groups/DELETE_GROUP_EVENTS"

const load = (data, type, id) => ({
    type,
    data,
    id
})

const removeEvent = (groupId, eventId) => ({
    type: DELETE_EVENT,
    eventId,
    groupId
})

const initialState = {}

export const getEventsFromGroup = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}/events`)
    const data = await response.json();
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
        case DELETE_EVENT: {
            for (let id in state[action.groupId]) {
                if (obj[id].id === action.eventId) {
                    delete obj[id].id
                }
            }
            return {
                ...state
            }
        }
        default:
            return state
    }
}

export default groupEventsReducer
