import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEventDetails } from '../../store/eventdetails'
import { getGroupDetails } from '../../store/groupdetails'
import { useEventHeader } from '../../context/EventHeader'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useIsDeletedObj } from '../../context/IsDeleted'
import DeleteEventModal from '../DeleteEventModal/DeleteEventModal'




const EventDetails = () => {
    const [isHidden, setIsHidden] = useState('hidden')
    const {setIsGrayG, setIsGrayE} = useEventHeader()
    const dispatch = useDispatch()
    const {eventId, groupId} = useParams()
    const {isDeleted, setIsDeleted} = useIsDeletedObj()
    const navigate = useNavigate()

    //dispatch get all groups, compare groupId of event to groups, if match, return Organizer name.


    useEffect(()=> {
        dispatch(getEventDetails(eventId))
        dispatch(getGroupDetails(groupId))
        if (isDeleted) {
            setIsDeleted(false)
            navigate(`/groups/${groupId}/details`)
        }
    }, [eventId, isDeleted])

    const onClickE = () => {
        setIsGrayE('')
        setIsGrayG('gray')
        return
    }
    const details = useSelector((state) => {
        if (state.eventDetails[eventId]) {
            return state.eventDetails[eventId]
        }
        return
    })

    const groupDetails = useSelector((state) => {
        if (state.groupDetails[groupId]) {
            return state.groupDetails[groupId]
        }
    })

    const userId = useSelector((state)=>{
        if (state.session.user) {
            return state.session.user.id
        }
    })

    if (details && groupDetails) {
        const hiddenClass = () => {
            if (groupDetails.Organizer.id === userId && isHidden) {
                setIsHidden('')
                return isHidden
            }
            return isHidden
        }
        //event preview image, group preview image, public/private/, start/endate, price, online/in person, details
        let hostName = `${groupDetails.Organizer.firstName} ${groupDetails.Organizer.lastName}`
        const {name, EventImages, type, price, startDate, endDate, description} = details
        const {GroupImages} = groupDetails
        let groupImg
        let eventImg
        EventImages.forEach(image => {
            if (image.previewImg) {
                eventImg = image.url
            }
        })

        GroupImages.forEach(image => {
            if (image.preview) {
                groupImg = image.url
            }
        })

        return (
            <>
            <section className='top-event-details'>
                <Link onClick={onClickE} to={'/groups'}>{'< Events'}</Link>
                <h2>{name}</h2>
                <p>Hosted by: {hostName}</p>
            </section>
            <section className='bottom-event-details'>
                <p>{eventImg}</p>
                <div className="group-name-img">
                    <p>{groupImg}</p>
                    <h3>{groupDetails.name}</h3>
                    <p>{type}</p>
                </div>
                <div>
                    <div className ="start-end-date">
                        <p>Start {startDate}</p>
                        <p>End {endDate}</p>
                    </div>
                    <p>{price ? price : 'Free'}</p>
                    <p>{type}</p>
                    <div className={hiddenClass()}>
                    <button className={hiddenClass()}>Update</button>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId}/>}
                    />
                    </div>
                </div>
                <h2>Details</h2>
                <p>{description}</p>
            </section>
            </>
        )
    } else {
        return (
            <p>Loading</p>
        )
    }



}



export default EventDetails
