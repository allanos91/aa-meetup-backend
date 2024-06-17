import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails } from "../../store/groupdetails";
import { getGroups } from "../../store/groups";
import { getEventsFromGroup } from "../../store/groupevents";
import UpComingEvent from "./UpComingEvents";
import { useNumEvents } from '../../context/NumUpEvents'
import { useNumPastEvents } from "../../context/PastEvents";
import PastEvents from "./PastEvents";
import './GroupDetails.css'
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal/DeleteGroupModal";
import { useIsDeletedObj } from '../../context/IsDeleted'
import { useEventHeader } from "../../context/EventHeader";

const GroupDetails = () => {
    const [isHidden, setIsHidden] = useState('hidden')
    const [creatorOptions, setCreatorOptions] = useState('hidden')
    const {numUpEvents} = useNumEvents()
    const {numPastEvents} = useNumPastEvents()
    const {groupId} = useParams()
    const {isDeleted, setIsDeleted} = useIsDeletedObj()
    const {setIsGrayE, setIsGrayG} = useEventHeader()
    const dispatch = useDispatch()
    const navigate = useNavigate()



    useEffect(() => {
        dispatch(getGroupDetails(groupId))
        dispatch(getGroups())
        dispatch(getEventsFromGroup(groupId))
        if (isDeleted) {
            setIsDeleted(false)
            navigate('/groups')
        }
    }, [numUpEvents, numPastEvents, isHidden, setIsHidden, creatorOptions, isDeleted])

    const onClick = () => {
        alert('Feature coming soon!')
    }

    const gOnClick = () => {
        setIsGrayE('gray')
        setIsGrayG('')
    }

    const group = useSelector((state) => {
        return state.groupDetails[groupId]
    })

    const numEvents = useSelector((state) => {
        if (state.groupEvents[groupId]) {
            return state.groupEvents[groupId].length
        }
        return
    })

    const currUser = useSelector((state) => {

        if (state.session.user) {
            return state.session.user.id
        } else return 0
    })

    const groupCreatorId = useSelector((state) => {
        if (state.groupDetails[groupId]) {
            return state.groupDetails[groupId].Organizer.id
        }
    })

    const isHiddenFunc = (num) => {
        if (num === 0) {
            return 'hidden'
        } else {
            return ''
        }
    }

    const isUserCreatedGroup = (userid, groupid) => {
        if (userid === groupid || !userid) {
            return 'hidden'
        } else {
         return ''
        }
    }
    if (currUser === groupCreatorId && creatorOptions === 'hidden') {
        setCreatorOptions('')
    }

    if (currUser !== groupCreatorId && creatorOptions !== 'hidden') {
        setCreatorOptions('hidden')
    }
    if (group) {
        const {id, name, city, state, Organizer, GroupImages, about} = group

        let previewImage
        GroupImages.forEach(image => {
            if (image.preview) {
                previewImage = image.url
            }
        })
        return (
            <>
            <section className="top">
            <Link to={'/groups'} className="group-link" onClick={gOnClick}>{'< Groups'}</Link>
            <div className="top-content">
            <img className="group-image" src={previewImage}/>
            <div className="content-grid">
            <h2 className="t-content">{name}</h2>
            <p className="t-content location-detail">{city}, {state}</p>
            <div className='numevents-detail t-content'>
                <p>{numEvents} events</p>
                <p className='center-dot'>.</p>
                <p>{group.private ? 'Private' : 'Public'}</p>
            </div>
            <p className="t-content organizer-info">Organized by {Organizer.firstName} {Organizer.lastName}</p>
            <button className={`${isUserCreatedGroup(currUser, groupCreatorId)} t-content join-button`} onClick={onClick}>Join this group</button>
                <div className={`${creatorOptions} t-content creator-buttons`}>
                <button className={creatorOptions} id="create-event-button" onClick={()=>navigate(`/groups/${id}/events/new`)}>Create event</button>
                <button className={creatorOptions} id="update-event-button" onClick={()=>navigate(`/groups/${id}/edit`)} >Update</button>
                <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteGroupModal groupId={groupId}/>}
                />
                </div>
            </div>
            </div>
            </section>
            <section className="middle">
                <div className= "middle-organizer">
                <h2 className="margin-org">Organizer</h2>
                <p className="organizer-middle">{Organizer.firstName} {Organizer.lastName}</p>
                </div>
                <div>
                <h2 className="about-detail-title">What we&apos;re about</h2>
                <p className="about-detail-page">{about}</p>
                </div>
            </section>
            <section className="bottom">
                <div className={`${isHiddenFunc(numUpEvents)}`}>
                    <h2 className="up-coming-title">Upcoming Events ({numUpEvents})</h2>
                    <UpComingEvent id={id}/>
                </div>
                <div className={isHiddenFunc(numPastEvents)}>
                    <h2 className="up-coming-title">Past Events ({numPastEvents})</h2>
                    <PastEvents id={id}/>
                </div>
            </section>
            </>
        )
    } else {
        return (
            <p>loading...</p>
        )
    }





}

export default GroupDetails
