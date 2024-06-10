// import { getEventDetails } from '../../store/eventdetails';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect} from 'react'
import { getEventDetails } from '../../store/eventdetails';




const EventDetails = (id) => {
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getEventDetails(id.id))
    }, [])

    const details = useSelector((state) => {
        if (state.eventDetails[id.id]) {
            return state.eventDetails[id.id]
        }
        return
    })

    if (details) {
        return (
            <p>{details.description}</p>
        )
    } else {
        return (
            <p>Loading</p>
        )
    }
}

export default EventDetails
