import { useParams, Link } from "react-router-dom"
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

const GroupDetails = () => {
    const [isHidden, setIsHidden] = useState('hidden')
    const [creatorOptions, setCreatorOptions] = useState('hidden')
    const {numUpEvents} = useNumEvents()
    const {numPastEvents} = useNumPastEvents()
    const {groupId} = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getGroupDetails(groupId))
        dispatch(getGroups)
        dispatch(getEventsFromGroup(groupId))
    }, [numUpEvents, numPastEvents, isHidden, setIsHidden, creatorOptions])

    const onClick = () => {
        setIsHidden('')
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

    if (currUser !== groupCreatorId && creatorOptions !== 'hidden' ) {
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
            <Link to={'/groups'}>{'< Groups'}</Link>
            <p>{previewImage}</p>
            <h2>{name}</h2>
            <p>{city}, {state}</p>
            <div className='numevents'>
                <p>{numEvents} events</p>
                <p className='center-dot'>.</p>
                <p>{group.private ? 'Private' : 'Public'}</p>
            </div>
            <p>Organized by {Organizer.firstName} {Organizer.lastName}</p>
            <button className={isUserCreatedGroup(currUser, groupCreatorId)} onClick={onClick}>Join this group</button>
            <button className={creatorOptions}>Create event</button>
            <button className={creatorOptions}>Update</button>
            <button className={creatorOptions}>Delete</button>
            <p className={isHidden}>Feature coming soon!</p>
            </section>
            <section className="middle">
                <div>
                <h2>Organizer</h2>
                <p>{Organizer.firstName} {Organizer.lastName}</p>
                </div>
                <div>
                <h2>What we&apos;re about</h2>
                <p>{about}</p>
                </div>
            </section>
            <section className="bottom">
                <div className={isHiddenFunc(numUpEvents)}>
                    <h2>Upcoming Events ({numUpEvents})</h2>
                    <UpComingEvent id={id}/>
                </div>
                <div className={isHiddenFunc(numPastEvents)}>
                    <h2>Past Events ({numPastEvents})</h2>
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
