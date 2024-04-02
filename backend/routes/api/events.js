// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
const { Event, Attendee, Eventimage, Group, Venue, Member } = require('../../db/models');

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
        throw err
    }

    const { groupId, venueId, name, type, capacity, price, description, startDate, endDate } = req.body
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
            throw err
        }
    }


    //edit event details
    event.set({
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
    res.json(event)
})

//add an image to an event specified by id
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
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
        err.status = 400
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
            id: parseInt(req.params.eventId)
        }
    })
    let obj = {...event.toJSON(), numAttending: numAttending + 1, groupData, venueData, eventImages}
    res.json(obj)
})


//gets all events, numAttending, previewImage
router.get('/', requireAuth, async (req, res, next) => {
    //find all events
    const events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description']
        }
    })
    let arr = []
    //gets numAttendee aggregate data and gets preview image, combines with event, then gets pushed into an array.
    for (let i = 0; i < events.length; i++) {
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
        obj.numAttending = numAttendees + 1

        //get related group data
        const group = await Group.findOne({
            attributes: {
                exclude: ['private', 'groupType', 'about','createdAt', 'updatedAt']
            },
            where: {
                id: events[i].dataValues.groupId
            },

        })
        //combines group data into object
        obj.groupData = group.toJSON()

        //get related venue if exists
        const venue = await Venue.findOne({
            attributes: {
                exclude: ['groupId', 'address', 'lat', 'lng', 'createdAt', 'updatedAt']
            },
            where: {
                id: events[i].dataValues.venueId
            }
        })
        venue ? obj.venueData = venue.toJSON() : obj.venueData = null
        arr.push(obj)
    }
    //returns the array
    res.json(arr)
})




module.exports = router
