// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
const { validDate, formatDate } = require('../../utils/validation')
const { Event, Attendee, Eventimage, Group, Venue, Member, User } = require('../../db/models');
const { format } = require('sequelize/lib/utils');


//delete attendance of an event specified by id
router.delete('/:eventId/attendance/:userId', requireAuth, async (req, res, next) => {
    //check if user exists
    const user = User.findByPk(parseInt(req.params.userId))

    if (!user) {
        const err = new Error("User couldn't be found")
        err.status = 404
        throw err
    }
    //check if event exists
    const event = await Event.findByPk(parseInt(req.params.eventId))

    if (!event) {
        const err = new Error('Event does not exist')
        err.status = 404
        throw err
    }
    //check if attendee exists
    const attendee = await Attendee.findOne({
        where: {
            userId: parseInt(req.params.userId),
            eventId: event.dataValues.id
        }
    })
    if (!attendee) {
        const err = new Error("Attendance does not exist for this User")
        err.status = 404
        throw err
    }
    //check if user is organizer or deleting themselves
    const group = await event.getGroup()
    const organizerId = group.dataValues.organizerId
    const isDelSelf = req.user.dataValues.id === attendee.dataValues.userId

    if (!(req.user.dataValues.id === organizerId || isDelSelf)) {
        const err = new Error('Only organizer can delete attendance.')
        err.status = 403
        throw err
    }
    //delete attendance
    await attendee.destroy()
    res.json("Successfully deleted attendance from event")

})

//change the status of attendance for event specified by id.
router.put('/:eventId/attendance', requireAuth, async (req, res, next) => {
    //check if event exists
    const event = await Event.findByPk(parseInt(req.params.eventId))

    if (!event) {
        const err = new Error('Event does not exist')
        err.status = 404
        throw err
    }

    //check if user is organizer or co-host
    const currUserId = req.user.dataValues.id
    const group = await event.getGroup()
    const organizerId = group.dataValues.organizerId
    const isCohost =  await Member.findOne({
        where: {
            userId: currUserId,
            groupId: group.dataValues.id,
            status: 'co-host'
        }
    })
    if (!(currUserId === organizerId || isCohost)) {
        const err =  new Error('User is not the organizer or co-host of the group.')
        err.status = 403
        throw err
    }

    const { userId, status } = req.body

    //throws error if changing status to pending
    if (status === 'pending') {
        const err = new Error('Cannot change status to pending')
        err.status = 400
        throw err
    }

    //check if attendee exists
    const attendee = await Attendee.findOne({
        where: {
            userId,
            eventId: parseInt(req.params.eventId),
        }
    })
    if (!attendee) {
        const err = new Error('Attendance between the user and event does not exist')
        err.status = 404
        throw err
    }
    const editAttendee = await attendee.set({
        status
    })
    editAttendee.save()
    delete editAttendee.dataValues.createdAt
    delete editAttendee.dataValues.updatedAt
    res.json(editAttendee)
})


//Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', async(req, res, next) => {
    //check if event exists
    const event = await Event.findByPk(parseInt(req.params.eventId))

    if (!event) {
        const err = new Error('Event does not exist')
        err.status = 404
        throw err
    }
    //check if user is organizer or co-host
    const group = await event.getGroup()
    const organizerId = group.dataValues.organizerId
    const isCohost = await Member.findOne({
        where: {
            userId: req.user.dataValues.id,
            groupId: group.dataValues.id,
            status: 'co-host'
        }
    })

    //get attendees based on cohost/organizer status
    let attendees

    if (req.user.dataValues.id === organizerId || isCohost) {
        attendees = await Attendee.findAll({
            where: {
                eventId: event.dataValues.id,
            }
        })
    } else {
        attendees = await Attendee.findAll({
            where: {
                eventId: event.dataValues.id,
                status: ['attending', 'waitlist']
            }
        })
    }

    //get user info for each attendee
    let arr = []
    for (let i = 0; i < attendees.length; i++) {
        let obj = {}

        const userInfo = await User.findByPk(attendees[i].dataValues.userId)
        obj.id = userInfo.dataValues.id
        obj.firstName = userInfo.dataValues.firstName
        obj.lastName = userInfo.dataValues.lastName
        obj.Attendance = {
            status: attendees[i].dataValues.status
        }

        arr.push(obj)
    }
    res.json({Attendees: arr})
})



//request to attend event based on event Id
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    // checks if event exists
    const event = await Event.findByPk(parseInt(req.params.eventId))
    if (!event) {
        const err = new Error('Event does not exist')
        err.status = 404
        next(err)
        return
    }
    //check if user is a member
    const groupId = event.dataValues.groupId
    const member = await Member.findOne({
        where: {
            groupId,
            userId: req.user.dataValues.id
        }
    })
    if (!member) {
        const err = new Error("User must be a member to request attendance")
        err.status = 403
        next(err)
        return
    }

    //check if user has pending request

    const userId = req.user.dataValues.id
    const eventId = parseInt(req.params.eventId)
    const status = 'pending'
    const hasStatus = await Attendee.findOne({
        where: {
            userId,
            eventId
        }
    })
    if (hasStatus) {
        const err = new Error('User status is already pending or attending.')
        err.status = 400
        throw err
    }

    //creates attendee
    const attendee = await Attendee.create({
        userId,
        eventId,
        status
    })
    res.json(attendee)
})

//delete an event specified by id
router.delete('/:eventId', requireAuth, async (req, res, next) => {
    //check if event exists
    const event = await Event.findOne({
        where: {
            id: parseInt(req.params.eventId)
        }
    })

    if (!event) {
        const err = new Error('Event does not exist')
        err.status = 404
        throw err
    }
    // check if user is organizer or co-host
    const group = await event.getGroup({
        where: {
            id: event.dataValues.groupId
        }
    })
    const organizerId = group.dataValues.organizerId
    const isCohost = await Member.findOne({
        where: {
            userId : req.user.dataValues.id,
            groupId : group.dataValues.id,
            status : 'co-host'
        }
    })
    if (!(organizerId === req.user.dataValues.id || isCohost)) {
        const err = new Error('User must be organizer or co-host')
        err.status = 400
        throw err
    }
    //deletes the event
    await event.destroy()

    res.json({
        message: "Event successfully deleted."
    })
})

//edits an event specified by id
router.put('/:eventId', requireAuth, async (req, res, next) => {
    try {
        //check if event exists
    const event = await Event.findOne({
        where: {
            id: parseInt(req.params.eventId)
        }
    })
    if (!event) {
        const err = new Error('Event does not exist')
        err.status = 404
        next(err)
        return
    }
    //check if user is organizer or co-host
    const group = await event.getGroup({
        where: {
            id: event.dataValues.groupId
        }
    })
    const organizerId = group.dataValues.organizerId
    const isCohost = await Member.findOne({
        where: {
            userId : req.user.dataValues.id,
            groupId: group.dataValues.id,
            status: 'co-host'
        }
    })
    if (!(req.user.dataValues.id === organizerId || isCohost)) {
        const err = new Error('User must be organizer or co-host')
        err.status = 400
        next(err)
        return
    }

    const {venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    //check if venue exists

    if (venueId) {
        const venue = await Venue.findOne({
            where: {
                id: venueId
            }
        })
        if (!venue) {
            const err = new Error('Venue does not exist')
            err.status = 404
            next(err)
            return
        }
    }


    //edit event details
    await event.set({
        venueId: venueId ? venueId : event.dataValues.venueId,
        name: name ? name : event.dataValues.name,
        type: type ? type : event.dataValues.type,
        capacity: capacity ? capacity : event.dataValues.capacity,
        price: price ? price : event.dataValues.price,
        description: description ? description : event.dataValues.description,
        startDate: startDate ? startDate : event.dataValues.startDate,
        endDate: endDate  ? endDate : event.dataValues.endDate
    })
    await event.save()
    delete event.dataValues.createdAt
    delete event.dataValues.updatedAt
    //format start and end date
    const sDateToFormat = event.dataValues.startDate
    const eDateToFormat = event.dataValues.endDate
    event.dataValues.startDate = formatDate(sDateToFormat)
    event.dataValues.endDate = formatDate(eDateToFormat)
    res.json(event)
    } catch (error) {
        error.message = "Validation error"
        error.status = 401
        next(error)
    }

})

//add an image to an event specified by id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    //check if event exists
    const event = await Event.findByPk(parseInt(req.params.eventId))
    if (!event) {
        const err = new Error("Event could not be found")
        err.status = 404
        next(err)
        return
    }

    //check if user is attending event
    const isAttending = await Attendee.findOne({
        where: {
            eventId: parseInt(req.params.eventId),
            userId: req.user.dataValues.id,
            status: 'attending'
        }
    })
    if (!isAttending) {
        const err = new Error("User must be an attendee to add an image.")
        err.status = 403
        throw err
    }

    let { url, previewImg } = req.body
    const newImage = await Eventimage.create({
        eventId: parseInt(req.params.eventId),
        url,
        previewImg,
    })
    res.json({
        id: newImage.dataValues.id,
        url : newImage.dataValues.url,
        previewImg: newImage.dataValues.previewImg
    })
})

//gets details of event specified by id
router.get('/:eventId',  async (req, res, next) => {
    //find event
    const event = await Event.findOne({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description']
        },
        where: {
            id : parseInt(req.params.eventId)
        }
    })
    //checks if event exists
    if (!event) {
        const err = new Error('Event could not be found.')
        err.status = 404
        throw err
    }
    //formatDate
    const sDateToFormat = event.dataValues.startDate
    const eDateToFormat = event.dataValues.endDate
    event.dataValues.startDate = formatDate(sDateToFormat)
    event.dataValues.endDate = formatDate(eDateToFormat)

    //gets numAttending aggregate data
    const numAttending = await Attendee.count({
        where: {
            eventId: event.dataValues.id,
            status: 'attending'
        }
    })

    //gets group
    const groupData = await Group.findOne({
        attributes: {
            exclude: ['groupType', 'about','createdAt', 'updatedAt']
        },
        where: {
            id: event.dataValues.groupId
        }
    })
    //gets venue if exists
    const venueData = await Venue.findOne({
        attributes: {
            exclude: ['groupId', 'createdAt', 'updatedAt']
        },
        where: {
            id: event.dataValues.venueId
        }
    })
    //gets eventImages if exists
    const eventImages = await Eventimage.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'eventId']
        },
        where: {
            eventId: parseInt(req.params.eventId)
        }
    })
    let obj = {...event.toJSON(), numAttending: numAttending, Group: groupData, Venue: venueData, EventImages: eventImages}
    res.json(obj)
})


//gets all events, numAttending, previewImage, add query params: page, size, name, type, startDate
router.get('/', requireAuth, async (req, res, next) => {
    //validate page, size, name query params
    if (req.query.page) {
        if (typeof parseInt(req.query.page) !== "number" || req.query.page < 1) {
            const err = new Error ("Bad Request")
            err.status = 400
            err.errors ? err.errors.page = "Page must be greater than or equal to 1" : err.errors = {page: "Page must be greater than or equal to 1"}
            next(err)
            return
        }
    }
    if (req.query.size) {
        if (typeof parseInt(req.query.size) !== "number" || req.query.size < 1 || req.query.size > 20) {
            const err = new Error ("Bad Request")
            err.status = 400
            err.errors = {size: "Size must be between 1 and 20"}
            next (err)
            return
        }
    }

    if (req.query.name) {
        if (typeof req.query.name !== "string") {
            const err = new Error("Bad Request")
            err.status = 400
            err.errors = {name : "Name must be a string"}
            next(err)
            return
        }
    }

    //assign query param variables
    let page = req.query.page ? parseInt(req.query.page) : 1
    let size = req.query.size ? parseInt(req.query.size) : 20

    let { name, type, startDate } = req.query
    startDate ? startDate = new Date(startDate) : null
    let queryParams = {name, type, startDate}


    //validate startDate and type params
    if (req.query.startDate) {
        if (!validDate(startDate)) {
            const err = new Error("Bad Request")
            err.status = 400
            err.errors = {startDate: "Start date must be a valid datetime"}
            next(err)
            return
        }
    }


    if (req.query.type) {
        if ((type !== 'Online' || type !== 'In Person')) {
            const err = new Error("Bad Request")
            err.status = 400
            err.errors = {type: "Type must be 'Online' or 'In Person'"}
            next(err)
            return
        }
    }

    for (let key in queryParams) {
        if (!queryParams[key]) {
            delete queryParams[key]
        }
    }
    //find all events
    const events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description']
        },
        where: {
            ...queryParams
        },
        limit: size,
        offset: size * (page - 1),
    })

    let arr = []
    //gets numAttendee aggregate data and gets preview image, combines with event, then gets pushed into an array.
    for (let i = 0; i < events.length; i++) {
        const startDate = events[i].dataValues.startDate
        const endDate = events[i].dataValues.endDate
        events[i].dataValues.startDate = formatDate(startDate)
        events[i].dataValues.endDate = formatDate(endDate)
        let obj = {...events[i].toJSON()}
        //gets aggregate attendees
        const numAttendees = await Attendee.count({
            where: {
                eventId: events[i].dataValues.id,
                status: 'attending'
            }
        })
        //gets preview image
        const previewImage = await Eventimage.findOne({
            attributes: ['url'],
            where: {
                eventId: events[i].dataValues.id,
                previewImg: true
            }
        })
        //combines if previewImage exists
        if (previewImage) {
            obj.previewImage = previewImage.toJSON().url
        }
        obj.previewImage ? obj.previewImg : obj.previewImg = null
        obj.numAttending = numAttendees

        //get related group data
        const group = await Group.findOne({
            attributes: {
                exclude: ['private', 'type', 'about','createdAt', 'updatedAt']
            },
            where: {
                id: events[i].dataValues.groupId
            },

        })
        //combines group data into object
        obj.Group = group.toJSON()

        //get related venue if exists
        const venue = await Venue.findOne({
            attributes: {
                exclude: ['groupId', 'address', 'lat', 'lng', 'createdAt', 'updatedAt']
            },
            where: {
                id: events[i].dataValues.venueId
            }
        })
        venue ? obj.Venue = venue.toJSON() : obj.venueData = null
        arr.push(obj)
    }
    //returns the array
    res.json({Events: arr})
})





module.exports = router
