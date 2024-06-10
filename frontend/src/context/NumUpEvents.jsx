import {createContext, useState, useContext} from 'react'

const NumEvents = createContext();

export function NumEventsProvider({children}) {
    const [numUpEvents, setNumUpEvents] = useState(0)
    const [groupId, setGroupId] = useState(0)

    const contextValue = {
        setNumUpEvents,
        numUpEvents,
        groupId,
        setGroupId
    }

    return (
        <NumEvents.Provider value = {contextValue}>
            {children}
        </NumEvents.Provider>
    )
}

export const useNumEvents = () => useContext(NumEvents)
