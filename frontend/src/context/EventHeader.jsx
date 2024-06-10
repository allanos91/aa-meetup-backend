import {createContext, useState, useContext} from 'react'

const EventHeader = createContext();

export function EventHeaderProvider({children}) {
    const [isGrayG, setIsGrayG] = useState('')
    const [isGrayE, setIsGrayE] = useState('gray')

    const contextValue = {
        isGrayE,
        isGrayG,
        setIsGrayE,
        setIsGrayG
    }

    return (
    <EventHeader.Provider value = {contextValue}>
        {children}
    </EventHeader.Provider>
    )
}

export const useEventHeader = () => useContext(EventHeader)
