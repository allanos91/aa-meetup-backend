const LOAD_GROUPS = "groups/LOAD_GROUPS"
const POST_GROUP = "group/POST_GROUP"


const load = (data, type, id) => ({
    type,
    data,
    id
})

const post = (data) => ({
    data,
    type: POST_GROUP
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
        default:
            return state;
    }
}


export default groupsReducer;
