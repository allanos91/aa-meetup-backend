import { createContext, useState, useContext} from 'react'

const NumPastEvents = createContext();

export function NumPastEventsProvider({children}) {
    const [numPastEvents, setNumPastEvents] = useState(0)

    const contextValue = {
        setNumPastEvents,
        numPastEvents
    }

    return (
        <NumPastEvents.Provider value = {contextValue}>
            {children}
        </NumPastEvents.Provider>
    )
}

export const useNumPastEvents = () => useContext(NumPastEvents)
