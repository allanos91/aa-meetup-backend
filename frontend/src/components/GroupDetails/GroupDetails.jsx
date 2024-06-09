import { useParams, Link } from "react-router-dom"
import { useEffect, useState} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { getGroupDetails } from "../../store/groupdetails";
import { getGroups } from "../../store/groups";
import { getEventsFromGroup } from "../../store/groupevents";
import UpComingEvent from "./UpComingEvents";
import { useNumEvents } from '../../context/NumUpEvents'

const GroupDetails = () => {
    const {numUpEvents} = useNumEvents()
    const {groupId} = useParams()
    const [upIsHidden, setUpIsHidden] = useState(false)
    const [downIsHidden, setDownIsHidden] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getGroupDetails(groupId))
        dispatch(getGroups)
        dispatch(getEventsFromGroup(groupId))
    }, [numUpEvents])

    const group = useSelector((state) => {
        return state.groupDetails[groupId]
    })

    const numEvents = useSelector((state) => {
        if (state.groupEvents[groupId]) {
            return state.groupEvents[groupId].length
        }
        return
    })

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
            <button>Join this group</button>
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
                <div>
                    <h2>Upcoming Events ({numUpEvents})</h2>
                    <UpComingEvent id={id}/>
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
