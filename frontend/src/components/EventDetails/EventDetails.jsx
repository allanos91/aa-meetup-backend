import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEventDetails } from '../../store/eventdetails'
import { getGroupDetails } from '../../store/groupdetails'
import { useEventHeader } from '../../context/EventHeader'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useIsDeletedObj } from '../../context/IsDeleted'
import DeleteEventModal from '../DeleteEventModal/DeleteEventModal'
import "./EventDetails.css"




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
                <h2 className='top-event-name'>{name}</h2>
                <p className='host-name'>Hosted by: {hostName}</p>
            </section>
            <section className='bottom-event-details'>
                <div className='mid-section'>
                    <img src={eventImg} className='event-detail-image'/>
                    <div className="group-name-img">
                        <img className='event-detail-group-image' src={groupImg}/>
                        <h3>{groupDetails.name}</h3>
                        <p className='event-group-detail-type'>{type}</p>
                    </div>
                    <div className='event-detail-info'>
                        <div className ="start-end-date">
                            <p className='start-text'>START</p>
                            <p className='start-date-num'>{startDate.split(' ')[0]}</p>
                            <p className='center-dot-event-detail-start'>.</p>
                            <p className='start-time-num'>{startDate.split(' ')[1]}</p>
                            <p>END</p>
                            <p className='end-date-num'>{endDate.split(' ')[0]}</p>
                            <p className='center-dot-event-detail-end'>.</p>
                            <p className='end-time-num'>{endDate.split(' ')[1]}</p>
                        </div>
                        <p>{price ? price : 'Free'}</p>
                        <div className='event-detail-price-button'>
                        <p className='event-detail-type'>{type}</p>
                        <div className={hiddenClass()} id='creator-buttons-event-detail'>
                        <button className={hiddenClass()}>Update</button>
                        <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteEventModal eventId={eventId}/>}
                        />
                        </div>
                        </div>
                    </div>
                </div>
                <h2 className='event-bottom-details'>Details</h2>
                <p className='event-bottom-details'>{description}</p>
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
