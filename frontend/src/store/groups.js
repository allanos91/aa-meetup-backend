import { csrfFetch } from "./csrf"

const LOAD_GROUPS = "groups/LOAD_GROUPS"
const POST_GROUP = "group/POST_GROUP"
const UPDATE_GROUP = "groups/UPDATE_GROUP"
const DELETE_GROUP = "group/DELETE_GROUP"
const REFRESH = "group/REFRESH"



const load = (data, type, id) => ({
    type,
    data,
    id
})

const post = (data) => ({
    data,
    type: POST_GROUP
})

const update = (data) => ({
    data,
    type: UPDATE_GROUP
})

const remove = (groupId) => ({
    type:DELETE_GROUP,
    groupId
})

const refresh = (data)=> ({
    data,
    type: REFRESH,
})

const initialState = {}

export const getGroups = () => async dispatch => {
    const response = await fetch(`/api/groups`)
    const data = await response.json();
    dispatch(load(data, LOAD_GROUPS))
    return data
}

export const postGroup = (data) => async dispatch => {
    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const group = await response.json()
        dispatch(post(group))
        return group
    }
}

export const updateGroupDetails = (data, id) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        const group = await response.json()
        dispatch(update(data))
        return group
    }
}

export const removeGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const res = response.json()
        dispatch(remove(groupId))
        return res
    }
}

export const refreshGroups = () => async dispatch => {
    const response = await csrfFetch(`/api/groups`)
    const data = await response.json()
    dispatch(refresh(data))
    return data
}

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const newGroups = {}
            action.data.Groups.forEach(group => {
                newGroups[group.id] = group
            })
            return {
                ...state,
                ...newGroups
            }
        }
        case POST_GROUP: {
            if (!state.groups) {
                state[action.data.id] = action.data
                const newState = {
                    ...state,
                };
                return newState
            }
            state[action.data.id] = action.data
            return {
                ...state
            }
        }
        case UPDATE_GROUP: {
            if (!state.groups) {
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
        case DELETE_GROUP: {
            delete state[action.groupId]
            return {
                ...state
            }
        }
        case REFRESH: {
            const newGroups = {}
            action.data.Groups.forEach(group => {
                newGroups[group.id] = group
            })
            return {
                ...newGroups
            }
        }
        default:
            return state;
    }
}


export default groupsReducer;
