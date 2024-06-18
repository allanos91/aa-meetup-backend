import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { postEvent } from "../../store/events"
import { postImageEvent } from "../../store/eventimages"
import { getEventsFromGroup } from "../../store/groupevents"
import { getEvents } from "../../store/events"
import { getGroups } from "../../store/groups"
import { getGroupDetails } from "../../store/groupdetails"
import "./CreateEventForm.css"


const CreateEventForm = () => {
    const [eName, setEName] = useState('')
    const [price, setPrice] = useState()
    const [startD, setStartD] = useState('')
    const [type, setType] = useState('In person')
    const [endD, setEndD] = useState('')
    const [img, setImg] = useState('')
    const [desc, setDesc] = useState('')
    const [Private, setPrivate] = useState(true)
    const [hidden, setHidden] = useState('hidden')
    const [errors, setErrors] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)

    const { groupId } = useParams()


    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleEName = (e) => setEName(e.target.value)
    const handlePrice = (e) => setPrice(e.target.value)
    const handleStartD = (e) => setStartD(e.target.value)
    const handleEndD = (e) => setEndD(e.target.value)
    const handleImg = (e) => setImg(e.target.value)
    const handleDesc = (e) => setDesc(e.target.value)
    const handleType = (e) => setType(e.target.value)
    const handlePrivate = (e) => {
        if (e.target.value === "Private") {
            setPrivate(true)
        } else {
            setPrivate(false)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (Object.values(errors).length) {
            setHidden('')
            return
        }
        let startDateStr = startD.split('T').join(' ') + ':00'
        let endDateStr = endD.split('T').join(' ') + ':00'


        const payload = {
            name: eName,
            type: type,
            capacity: 10,
            price: parseInt(price),
            description: desc,
            startDate: startDateStr,
            endDate: endDateStr
        }

        let res = await dispatch(postEvent(payload, groupId))

        const imagePayload = {
            url: img,
            preview: true
        }
        await dispatch(postImageEvent(imagePayload, res.id))

        await dispatch(getEventsFromGroup(groupId))
        await dispatch(getGroups())
        await dispatch(getEvents())
        await navigate(`/events/${res.id}/details/${groupId}`)
        return Private
    }

    const validateImg = (url) => {
        let urlArr = url.split('.')
        if (urlArr[urlArr.length-1] !== 'png' && urlArr[urlArr.length-1] !== 'jpg' && urlArr[urlArr.length-1] !== 'jpeg' ) {
            return false
        }
        return true
    }

    useEffect(() => {
        const errors = {}

        if (!eName.length) {
            errors.name = "Name is required"
        }
        if (!startD) {
            errors.startDate = "Start date and time is required"
        }

        if (!endD) {
            errors.endDate = "End date and time is required"
        }
        if (!validateImg(img)) {
            errors.image = "Image url must end in .png, .jpg, or .jpeg"
        }
        if (desc.length < 30) {
            errors.description = "Description must have 30 or more characters."
        }

        if (!price && price !== 0) {
            errors.price = "Price is required."
        }
        setErrors(errors)

        if (!isLoaded) {
            dispatch(getGroupDetails(groupId))
            dispatch(getGroups())
            dispatch(getEventsFromGroup(groupId)).then(() => {
                if (!isLoaded) {
                    setIsLoaded(true)
                }
            })
        }
    }, [eName, startD, endD, img, desc])

    const group = useSelector((state) => {
        return state.groupDetails[groupId]
    })

    if (isLoaded) {

        return (
            <form className="event-form" onSubmit={handleSubmit}>
            <section className="top-section-event-form">
                <h2 id="create-event-title">Create an event for {group.name}</h2>
                <label htmlFor="Event Name" className="label-event-name">What is the name of your event?</label>
                <input name ="Event Name" placeholder="Event Name" onChange={handleEName}/>
                <p className={`errors ${hidden}`}>{errors.name}</p>
            </section>
            <section className="second-section-event-form">
                <div>
                    <label htmlFor="type" className="margin-top-event-form">Is this an in person or online event?</label>
                    <select name="type" onChange={handleType}>
                        <option>In person</option>
                        <option>Online</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="private" onChange={handlePrivate} className="margin-top-event-form">Is this event private or public?</label>
                    <select name="private">
                        <option>public</option>
                        <option>private</option>
                    </select>
                </div>
                <label htmlFor="price" className="margin-top-event-form">What is the price for your event?</label>
                <input name="price" type="number" onChange={handlePrice} placeholder="0"/>
                <p className={`errors ${hidden}`}>{errors.price}</p>
            </section>
            <section className="third-section-event-form">
                <div className="third-section-div-event-form">
                <label htmlFor="start-date" className="margin-top-event-form">When does your event start?</label>
                <input name="start-date" type="datetime-local" placeholder="MM/DD/YYYY, HH/mm AM" onChange={handleStartD}/>
                <p className={`errors ${hidden}`}>{errors.startDate}</p>
                </div>
                <div>
                <label htmlFor="end-date" className="margin-top-event-form">When does your event end?</label>
                <input name="end-date" type="datetime-local" placeholder="MM/DD/YYYY, HH/mm AM" onChange={handleEndD}/>
                <p className={`errors ${hidden}`}>{errors.endDate}</p>
                </div>
            </section>
            <section className="fourth-section-event-form">
                <label>Please add in image url for your event below</label>
                <input placeholder="Image Url" onChange={handleImg}/>
                <p className={`errors ${hidden}`}>{errors.image}</p>
            </section>
            <section className="fifth-section-event-form">
                <label>Please describe your event:</label>
                <textarea placeholder="Please include at least 30 characters" onChange={handleDesc} className="text-area-event-form"></textarea>
                <p className={`errors ${hidden}`}>{errors.description}</p>
            </section>
            <button type="submit" className="submit-event-form-button">Create Event</button>
            </form>
        )
    }

}

export default CreateEventForm
