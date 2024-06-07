import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getEventsFromGroup } from "../../store/groupevents"


export const GroupEvents = (id) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getEventsFromGroup(id.id))
    },[])

    const eventsFromGroup = useSelector((state) => {
        return state.groupEvents
    })

    let numEvents = 0
    if (eventsFromGroup[id.id]) {
        numEvents = eventsFromGroup[id.id].length
    }
    return (
        <p>{numEvents} Events</p>
    )
}
