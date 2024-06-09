import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from '../../store/groups';
import { useEffect } from 'react';
import EventGroupHeader from '../EventGroupHeader/EventGroupHeader';
import { GroupEvents } from './GroupEvents'
import './AllGroups.css'
import { useNavigate } from "react-router-dom";
import { useEventHeader } from '../../context/EventHeader';
import { getEvents } from '../../store/events';
import EventDetails from './EventDetails'






const AllGroups = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { isGrayG, isGrayE} = useEventHeader()


    useEffect(() => {
        dispatch(getGroups())
        dispatch(getEvents())
    },[])

    const groups = useSelector((state) => {
        return Object.values(state.groups)
    })
    const events = useSelector((state) => {
        if (state.events) {
            return state.events.Events
        }
        return
    })
    const groupClassName = () => {
        if (isGrayG) {
            return 'group-box ' + 'hidden'
        } else {
            return 'group-box'
        }
    }
    const eventClassName = () => {
        if (isGrayE) {
            return 'event-box ' + 'hidden'
        } else {
            return 'event-box'
        }
    }

    if (events && events[0] && groups) {
        const formatDate = (date) => {
            let newDate = date.toISOString().split('T').join(' ').split('.')[0]
            return newDate
          }
        let sDateToArr = (date) => {
            let dateArr = date.split(' ')
            let time = parseInt(dateArr[1].split(':').join(''))
            let yyyymmdd = dateArr[0].split('-').map(num => {
                return parseInt(num)
            })
            dateArr = yyyymmdd.concat(time)
            dateArr[0] = dateArr[0] * 10000
            dateArr[1] = dateArr[1] * 100
            yyyymmdd = (dateArr[0] + dateArr[1] + dateArr[2]) * 100000
            time = dateArr[3]
            return yyyymmdd + time
        }
        let currDate = sDateToArr(formatDate(new Date()))
        let prevEvents = []
        let upEvents = []
        events.forEach(event => {
            if (sDateToArr(event.startDate) - currDate < 0) {
                prevEvents.push(event)
            } else {
                upEvents.push(event)
            }
        })

        prevEvents.sort((a, b) => sDateToArr(b.startDate) - sDateToArr(a.startDate))
        upEvents.sort((a,b) => sDateToArr(a.startDate) - sDateToArr(b.startDate))

        return (
            <main>
                <EventGroupHeader/>
                {groups.map(group => {
                    const {previewImage, name, about, city, state, id} = group
                    return (
                        <>
                        <div className={groupClassName()} key={`groupbox${id}`}>
                            <section key={id} className='group-section' onClick={() => navigate(`/groups/${id}/details`)}>
                                <div className='img'>{previewImage}</div>
                                <h2 key={name} className='groupname'>{name}</h2>
                                <h3 key="location" className='location'>{`${city}, ${state}`}</h3>
                                <p key="description" className='about'>{about}</p>
                                <div className='numevents'>
                                    <GroupEvents id={id} private={group.private}/>
                                    <p className='center-dot'>.</p>
                                    <p>{group.private ? 'Private' : 'Public'}</p>
                                </div>
                            </section>
                        </div>
                        </>
                    )
                })}
                {upEvents.map(event => {
                    return event
                })}
                {prevEvents.map(event => {
                    //event previewImage, start/end date, price, type, details, venue city/state ? group city/statesadf
                    const {id, previewImage, name, Venue, Group, startDate} = event
                    const cityState = () => {
                        if (Venue) {
                            return (
                                <p>{`${Venue.city} ${Venue.state}`}</p>
                            )
                        } else {
                            return (
                                <p>{`${Group.city} ${Group.state}`}</p>
                            )
                        }
                    }

                    return (
                        <>
                        <div className={eventClassName()} key={`eventbox${id}`}>
                            <section key={id} className='group-section'>
                                <div className='img'>{previewImage}</div>
                                <p>{startDate}</p>
                                <h2 key={name} className='eventname'>{name}</h2>
                                <h3>{cityState()}</h3>
                                <EventDetails id={id}/>
                            </section>

                        </div>
                        </>
                    )
                })}
            </main>
        )
    }
    return (
        <h1> Loading </h1>
    )
}

export default AllGroups
