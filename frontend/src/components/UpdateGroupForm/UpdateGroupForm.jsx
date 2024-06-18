import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getGroupDetails } from "../../store/groupdetails"
import { updateGroupDetails } from "../../store/groups"
import { postImageGroup } from "../../store/groupimages"
import "./UpdateGroupForm.css"




const UpdateGroupForm = () => {
    const navigate = useNavigate()
    const userInfo = useSelector((state) => {
        return state.session.user
    })



    const [isLoaded, setIsLoaded] = useState(false)
    const [location, setLocation] = useState('')
    const [gName, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [img, setImg] = useState('')
    const [errors, setErrors] = useState({})
    const [Private, setPrivate] = useState(false)
    const [type, setType] = useState('In person')
    const [hidden, setHidden] = useState('hidden')


    const dispatch = useDispatch()
    const {groupId} = useParams()
    const loadPrivate = (Private) => {
        if (Private) {
            return 'Private'
        } else {
            return 'Public'
        }
    }


    const handleLocation = (e) => setLocation(e.target.value)
    const handleName = (e) => setName(e.target.value)
    const handleDesc = (e) => setDesc(e.target.value)
    const handleImg = (e) => setImg(e.target.value)
    const handleType = (e) => setType(e.target.value)
    const handlePrivate = (e) => {
        if (e.target.value === "Private") {
            setPrivate(true)
        } else {
            setPrivate(false)
        }
    }

    const handleSubmit = async (e) => {
        try {

            e.preventDefault()

            if (Object.values(errors).length) {
                 setHidden('')
                 return
            }


            let splitLoc = location.split(', ')

            const payload = {
                name: gName,
                about: desc,
                type: type,
                private: Private,
                city: splitLoc[0],
                state: splitLoc[1]
            }
            let res = await dispatch(updateGroupDetails(payload, groupId))

            const imagePayload = {
                url: img,
                preview: true
            }

            await dispatch(postImageGroup(imagePayload, res.id))

            navigate(`/groups/${res.id}/details`)
        } catch (error) {
            navigate('/')
        }
    }
    const validateImg = (url) => {
        let urlArr = url.split('.')
        if (urlArr[urlArr.length-1] !== 'png' && urlArr[urlArr.length-1] !== 'jpg' && urlArr[urlArr.length-1] !== 'jpeg' ) {
            return false
        }
        return true
    }

    useEffect(() => {
        dispatch(getGroupDetails(groupId)).then(() => {
            setIsLoaded(true)
        })
        const errors = {}

        if (!gName.length) {
            errors.name = "Name is required"
        }

        if (!location.length) {
            errors.location = "Location is required"
        }

        if (desc.length < 50) {
            errors.desc = "Description must be at least 50 characters long"
        }

        if (!validateImg(img)) {
            errors.img = "Image URL must end in .png, .jpg, or .jpeg"
        }
        setErrors(errors)
    }, [dispatch, gName, location, desc, img])
    const groupDetails = useSelector((state) => {
        return state.groupDetails[groupId]
    })
    if (isLoaded) {
        //about, city, state, name, type
        const {about, city, state, name, type, GroupImages, organizerId} = groupDetails
        if (!userInfo || userInfo.id !== organizerId) {
            navigate('/')
        }


        if (!location) {
            setDesc(about)
            setLocation(`${city}, ${state}`)
            setName(name)
            setType(type)
            setPrivate(groupDetails.private)
            if (GroupImages) {
                GroupImages.forEach(image => {
                    if(image.preview) {
                        setImg(image.url)
                    }
                })
            }
        }
        return (
            <form className="group-form" onSubmit={handleSubmit}>
            <section className="header-section">
            <h1>UPDATE YOUR GROUP&apos;S INFORMATION</h1>
            <h2>We&apos;ll walk you through a few steps to update your group&apos;s information</h2>
            </section>
            <section className="group-location-section">
                <h2>First, set your group&apos;s location</h2>
                <h3>Cleet Up! groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can join you online.</h3>
                <input type="text" name="location" value={location} placeholder="City, STATE" onChange={handleLocation}/>
                <p className={`errors ${hidden}`}>{errors.location}</p>
            </section>
            <section className="group-name-section">
                <h2>What will your group&apos;s name be?</h2>
                <h3>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
                <input type="text" name="groupname" value={gName} placeholder="What is your group name?" onChange={handleName}/>
                <p className={`errors ${hidden}`}>{errors.name}</p>
            </section>
            <section className="group-description-section">
                <h2>Now describe what your group will be about</h2>
                <h3>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</h3>
                <ol>
                    <li>What&apos;s the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <textarea type="text" name="description" value={desc} placeholder="Please write at least 30 characters" onChange={handleDesc} className="text-area-group-1"></textarea>
                <p className={`errors ${hidden}`}>{errors.desc}</p>
            </section>
            <section className="final-steps">
                <h2>Final steps...</h2>
                <label htmlFor="type">Is this an in person or online group?</label>
                <select name="type" id="type" onChange={handleType}>
                    <option>In person</option>
                    <option>Online</option>
                </select>
                <label htmlFor="public">Is this group private or public?</label>
                <select name="public" id="public" onChange={handlePrivate} value={loadPrivate(Private)}>
                    <option>Public</option>
                    <option>Private</option>
                </select>
                <label htmlFor="image">Please add in image url for your group below</label>
                <input name="image" id="image" type="text" value={img} onChange={handleImg} placeholder="Image Url"/>
                <p className={`errors ${hidden}`}>{errors.img}</p>
            </section>
            <button type="submit" className="update-submit">Update Group</button>
        </form>
        )
    } else {
        return (
            <p>loading...</p>
        )
    }
}

export default UpdateGroupForm
