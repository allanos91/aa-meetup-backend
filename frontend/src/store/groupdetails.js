const LOAD_GROUP = "groups/LOAD_GROUP"

const load = (data, type, id) => ({
    type,
    data,
    id
})



const initialState = {}

export const getGroupDetails = (id) => async dispatch => {
    const response = await fetch(`/api/groups/${id}`)
    const data = await response.json()
    dispatch(load(data, LOAD_GROUP, id))
    return data
    }



const groupDetailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_GROUP: {
            const newGroup = {}
            newGroup[action.id] = action.data
            return {
                ...state,
                ...newGroup
            }
        }
        default:
            return state;
    }
}

export default groupDetailsReducer
