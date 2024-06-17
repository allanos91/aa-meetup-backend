import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useNumEvents } from '../../context/NumUpEvents'
import { useNavigate } from "react-router-dom";

const UpComingEvents = (id) => {
    const {numUpEvents, setNumUpEvents} = useNumEvents()
    const navigate = useNavigate()
    useEffect(() => {

    }, [])



    const groupEvents = useSelector((state) => {
        if (state.groupEvents) {
            return state.groupEvents[id.id]
        }
        return
    })


    if (groupEvents) {

        const formatDate = (date) => {
            let newDate = date.toISOString().split('T').join(' ').split('.')[0]
            return newDate
          }
        let currDate = new Date()
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


        let newEventArr = []
        groupEvents.forEach(event => {
            let startDateMod = sDateToArr(event.startDate)
            let currDateMod = sDateToArr(formatDate(currDate))
            //startdate - currdate is positive, then push in eventarr
            if (startDateMod - currDateMod > 0) {
                newEventArr.push(event)
            }
        })

        if (newEventArr.length !== numUpEvents) {
            setNumUpEvents(newEventArr.length)
        }

        if (newEventArr.length === 0) {
            return
        }

        return (
            <div>
            {newEventArr.map(event => {

                return (
                    <div key={event.id} className="event-box-detail">
                    <div className="event-detail format-event-detail" key={event.id} onClick={() => navigate(`/events/${event.id}/details/${id.id}`)}>
                        <img src={event.previewImage} className="event-img-detail"/>
                        <div className='start-date event-content-detail'>
                    <p className='event-date-detail'>{event.startDate.split(' ')[0]}</p>
                    <p className='event-time'>{event.startDate.split(' ')[1]}</p>
                    </div>
                    <h2 className="eventname-detail event-content-detail">{event.name}</h2>
                    <h3 className="event-location-detail event-content-detail">{event.Group.city} {event.Group.state}</h3>
                    <p className="event-description-detail">{event.description}</p>
                    </div>
                    </div>
                )
            })}
            </div>
        )
    } else {
        return (
            <p>Loading</p>
        )
    }
}

export default UpComingEvents
