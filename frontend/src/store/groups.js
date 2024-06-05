export const LOAD_GROUPS = "groups/LOAD_GROUPS"

const load = (groups) => ({
    type: LOAD_GROUPS,
    groups
})


const initialState = {}




export const getGroups = () => async dispatch => {
    const response = await fetch(`/api/groups`)
    const data = await response.json();
    dispatch(load(data))
    return response
}

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GROUPS: {
            const newGroups = {}
            action.groups.Groups.forEach(group => {
                newGroups[group.id] = group
            })
            return {
                ...state,
                ...newGroups
            }
        }
        default:
            return state;
    }
}


export default groupsReducer;
