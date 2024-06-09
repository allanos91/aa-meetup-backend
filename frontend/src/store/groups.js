const LOAD_GROUPS = "groups/LOAD_GROUPS"


const load = (data, type, id) => ({
    type,
    data,
    id
})




const initialState = {}


export const getGroups = () => async dispatch => {
    const response = await fetch(`/api/groups`)
    const data = await response.json();
    dispatch(load(data, LOAD_GROUPS))
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
        default:
            return state;
    }
}


export default groupsReducer;
