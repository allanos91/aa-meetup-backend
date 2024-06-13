import { csrfFetch } from "./csrf";

const POST_GROUP_IMG = "group/POST_IMAGE"

const post = (data, type, id) => ({
    type,
    data,
    id
})

const initialState = {}

export const postImageGroup = (data, groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        const img = await response.json()
        dispatch(post(img, POST_GROUP_IMG, groupId))
        return img
    }
}

const groupImagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_GROUP_IMG: {
            if (!state.groupImages) {
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
        default:
            return {
                ...state
            };
    }
}

export default groupImagesReducer;
