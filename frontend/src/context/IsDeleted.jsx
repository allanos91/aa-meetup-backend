import { createContext, useState, useContext } from "react";


const IsDeletedObj = createContext();

export function IsDeletedProvider({children}) {
    const [isDeleted, setIsDeleted] = useState(false)

    const contextValue = {
        isDeleted,
        setIsDeleted
    }

    return (
        <IsDeletedObj.Provider value = {contextValue}>
            {children}
        </IsDeletedObj.Provider>
    )
}

export const useIsDeletedObj = () => useContext(IsDeletedObj)
