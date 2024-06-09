import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useNumPastEvents } from '../../context/PastEvents'

const PastEvents = (id) => {
    const {numPastEvents, setNumPastEvents} = useNumPastEvents()

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
            //currdate-startdate is positive, then push in eventarr
            if (currDateMod - startDateMod > 0) {
                newEventArr.push(event)
            }
        })

        if (newEventArr.length !== numPastEvents) {
            setNumPastEvents(newEventArr.length)
        }

        if (newEventArr.length === 0) {
            return
        }

        return (
            <>
            {newEventArr.map(event => {
                return (
                    <>
                    <p key={event.id}>{event.previewImage ? event.previewImage: 'no image'}</p>
                    <p>{event.startDate}</p>
                    <h2>{event.name}</h2>
                    <p>{event.description}</p>
                    </>
                )
            })}
            </>
        )
    }
}

export default PastEvents
