// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { Group, Member, User, Groupimage, Venue, Attendee, Eventimage, Event } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');
const { formatDate, formatCandUDate } = require('../../utils/validation');


//delete member of a group specified by id
router.delete('/:groupId/membership/:memberId', requireAuth, async (req, res, next) =>{
    //check if group exists
    const userId = req.user.dataValues.id
    const groupId = parseInt(req.params.groupId)
    const group = await Group.findByPk(groupId)

    if (!group) {
        const err = new Error('Group does not exist')
        err.status = 404
        throw err
    }

    //check if member exists
    const memberId = parseInt(req.params.memberId)
    const member = await User.findByPk(memberId)

    if (!member) {
        const err = new Error('User does not exist.')
        err.status = 404
        throw err
    }

    //check if membership exists
    const membership = await Member.findOne({
        where: {
            groupId,
            userId: memberId
        }
    })

    if (!membership) {
        const err = new Error('Membership does not exist for this User.')
        err.status = 404
        throw err
    }

    //check if user is organizer/deleting themselves.
    const organizerId = group.dataValues.organizerId
    const isDelSelf = (userId === parseInt(req.params.memberId))

    if (!(organizerId === userId || isDelSelf)) {
        const err = new Error('User must be the organizer to remove other members.')
        err.status = 403
        throw err
    }
    await Member.destroy({
        where: {
            groupId,
            userId: memberId
        }
    })
    res.json({
        message: "Member successfully removed from group."
    })
})

//change status of membership of group specified by id.
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    //check if group exists
    const userId = req.user.dataValues.id
    const groupId = parseInt(req.params.groupId)
    const group = await Group.findByPk(groupId)

    if (!group) {
        const err = new Error('Group does not exist')
        err.status = 404
        next(err)
        return
    }


    //check if user is organizer or co-host
    const organizerId = group.dataValues.organizerId
    const isCohost = await Member.findOne({
        where: {
            userId,
            groupId,
            status: 'co-host'
        }
    })
    //checks organizer when change is co-host
    if (req.body.status === 'co-host' && userId !== organizerId) {
        const err = new Error('User must be organizer to change status to co-host')
        err.status = 403
        next(err)
        return
    }

    //checks both if change is member
    if (!(isCohost || userId === organizerId)) {
        const err = new Error('User must be organizer or co-host to accept membership requests')
        err.status = 403
        next(err)
        return
    }

    //checks if change to status is "pending"
    if (req.body.status === 'pending') {
        const err = new Error('Cannot change status to pending')
        err.status = 400
        next(err)
        return
    }

    //checks if member belongs to group
    const { memberId, status } = req.body

    const member = await Member.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    })

    if (!member) {
        const err = new Error('Member does not belong to group')
        err.status = 404
        throw err
    }
    //edits membership status
    await member.set({
        status
    })
    await member.save()
    delete member.dataValues.createdAt
    delete member.dataValues.updatedAt
    res.json(member)
})

//request membership for a group based on group id

router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupId = parseInt(req.params.groupId)
    const userId = req.user.dataValues.id

    //check if group exists
    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })
    if (!group) {
        const err = new Error('Group could not be found.')
        err.status = 404
        throw err
    }
    //check if member has status pending
    const member = await Member.findOne({
        where: {
            userId : userId,
            groupId: groupId,
        }
    })

    if (member) {
        const err = new Error('User status is already pending or accepted.')
        err.status = 400
        throw err
    }
    const newMember  = await Member.create({
        userId,
        groupId,
        status: 'pending'
    })
    delete newMember.dataValues.createdAt
    delete newMember.dataValues.updatedAt
    delete newMember.dataValues.groupId
    newMember.dataValues.memberId = newMember.dataValues.userId
    delete newMember.dataValues.userId
    res.json(newMember)
})

//get all members of a group specified by id.
router.get('/:groupId/members', async (req, res, next) => {

    //check if group exists
    const group = await Group.findOne({
        where: {
            id: parseInt(req.params.groupId)
        }
    })
    if (!group) {
        const err = new Error('Group does not exist')
        err.status = 404
        throw err
    }

    //get the members
    const members = await Member.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'groupId']
        },
        where: {
            groupId: parseInt(req.params.groupId)
        }
    })
    //checks if user is organizer of group or co-host
    const isOrganizer = group.dataValues.organizerId === req.user.dataValues.id
    const isCohost = await Member.findOne({
        where: {
            userId: req.user.dataValues.id,
            groupId: parseInt(req.params.groupId),
            status: 'co-host'
        }
    })

    //get user information for each member
    let arr = []

    for(let i = 0; i < members.length; i++) {
        let obj = {}
        const user = await User.findOne({
            where: {
                id: members[i].dataValues.userId
            }
        })

        if (!(isOrganizer || isCohost)) {
            if (members[i].dataValues.status === 'pending') {
                continue
            }
        }
        obj.id = user.dataValues.id
        obj.firstName = user.dataValues.firstName
        obj.lastName = user.dataValues.lastName
        obj.status = members[i].dataValues.status
        arr.push(obj)
    }

    res.json(arr)
})


//create an event for a group specified by id.
router.post('/:groupId/events', requireAuth, async(req, res, next) => {
    try {
        //find group by id
    const group = await Group.findOne({
        attributes: {
            exclude: ['private', 'groupType', 'about','createdAt', 'updatedAt']
        },
        where: {
            id: parseInt(req.params.groupId)
        }
    })
    //check if group exists
    if (!group) {
        const err = new Error('Group cannot be found.')
        err.status = 404
        next(err)
        return
    }
    //check if current user is the owner or co-host
    const organizerId = group.dataValues.organizerId
    const isCohost = await Member.findOne({
        where: {
            userId: parseInt(req.user.dataValues.id),
            groupId: parseInt(req.params.groupId),
            status: 'co-host'
        }
    })
    if (!(req.user.dataValues.id === organizerId || isCohost)) {
        const err = new Error('Must be organizer or co-host.')
        err.status = 403
        next(err)
        return
    }
    let { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    //checks if venue exists
    if (venueId) {
        const venueExists = await Venue.findOne({
            where: {
                id: req.body.venueId
            }
        })
        if (!venueExists) {
            const err = new Error('Venue could not be found.')
            err.status = 404
            next(err)
            return
        }
    }


    //creates event

    const newEvent = await Event.create({
        groupId: parseInt(req.params.groupId), venueId: venueId ? venueId : venueId = null, name, type, capacity, price, description, startDate: new Date(`${startDate}`), endDate: new Date(`${endDate}`)
    })

    //creates attendee for creator
     await Attendee.create({
        userId: parseInt(req.user.dataValues.id),
        eventId: newEvent.dataValues.id,
        status: 'attending'
    })

    //checks if endDate is after startDate
    if (new Date(`${startDate}`).getTime() >= new Date(`${endDate}`).getTime()) {
        await newEvent.destroy()
        const err = new Error('End date is less than start date')
        err.status = 400
        next (err)
        return
    }
    delete newEvent.dataValues.updatedAt
    delete newEvent.dataValues.createdAt

    //formats dates
    const sDateToFormat = newEvent.dataValues.startDate
    const eDateToFormat = newEvent.dataValues.endDate

    newEvent.dataValues.startDate = formatDate(sDateToFormat)
    newEvent.dataValues.endDate = formatDate(eDateToFormat)
    res.json(newEvent)
    } catch (error) {
        error.message = "Validation Error"
        error.status = 400
        next(error)
    }
})


//returns all events of a group specified by id.
router.get('/:groupId/events', async (req, res, next) => {

    //find group by id
    const group = await Group.findOne({
        attributes: {
            exclude: ['private', 'groupType', 'about','createdAt', 'updatedAt']
        },
        where: {
            id: parseInt(req.params.groupId)
        }
    })
    //check if group exists
    if (!group) {
        const err = new Error('Group can not be found.')
        err.status = 404
        throw err
    }
    //gets events from group
    const events = await group.getEvents({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })

    //gets numAttending aggregate data and gets preview image, combines with event, pushed into array
    let arr = []
    for (let i = 0; i < events.length; i++) {
        //format date
        const startDate = events[i].dataValues.startDate
        const endDate = events[i].dataValues.endDate
        events[i].dataValues.startDate = formatDate(startDate)
        events[i].dataValues.endDate = formatDate(endDate)

        let obj = {...events[i].toJSON()}
        //gets aggregate attending
        const numAttending = await Attendee.count({
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
        obj.numAttending = numAttending

        //get related group data
        obj.Group = group.toJSON()

        //get related venue data if exists
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
    res.json({Events:arr})
})


//Create a new venue for a group
router.post('/:groupId/venues', requireAuth, async(req, res, next) => {
    try {
        const groupId = parseInt(req.params.groupId)

        //finds group by id
        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })
        //checks if group exists
        if (!group) {
            const err = new Error('Group not found')
            err.status = 404
            next(err)
            return
        }
        //checks if user is organizer or co-host
        const userId = req.user.dataValues.id
        const organizerId = group.dataValues.organizerId
        const isCohost = await Member.findOne({
            where: {
                groupId: groupId,
                userId: userId,
                status: 'co-host'
            }
        })

        if (!(userId === organizerId || isCohost)) {
            const err = new Error('Must be organizer or co-host of group.')
            err.status = 403
            next(err)
            return
        }
        const { address, city, state, lat, lng } = req.body
        const newVenue = await Venue.create({
            groupId: groupId,
            address,
            city,
            state,
            lat,
            lng
        })
        delete newVenue.dataValues.createdAt
        delete newVenue.dataValues.updatedAt

        res.json(newVenue)
    } catch (error) {
        error.status = 400
        error.message = "Bad Request"
        next(error)
    }
})


//Get all venues for a group specified by id.
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    try {
        //check if group exists
        const group = await Group.findByPk(req.params.groupId)
        if (!group) {
            const err = new Error("Group couldn't be found")
            err.status = 404
            next(err)
            return
        }
        //check if user is organizer or co-host
        const organizerId = group.dataValues.organizerId
        const isCohost = await Member.findOne({
            where: {
                userId: req.user.dataValues.id,
                groupId: req.params.groupId,
                status: 'co-host'
            }
        })
        if (!(isCohost || req.user.dataValues.id === organizerId)) {
            const err = new Error("User must be organizer or co-host")
            err.status = 403
            next(err)
            return
        }

        const groupId = parseInt(req.params.groupId)
        const venues = await Venue.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                groupId : groupId
            }
        })

        if (!venues[0]) {
            const err = new Error('Group cannot be found.')
            err.status = 404
            throw err
        }

        res.json({Venues: venues})
    } catch (error) {
        next(error)
        return
    }
})


//adds an image to a group based on groupId
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.dataValues.id
        const group = await Group.findOne({
        where: {
            id: parseInt(req.params.groupId)
        }
    })

    if (!group) {
        const newErr = new Error('Group could not be found')
        newErr.status = 404
        next(newErr)
        return
    }


    if (userId !== group.dataValues.organizerId) {
        const err = new Error('Must be organizer of group to post new image.')
        err.status = 403
        next(err)
        return
    }

    const newImage = await Groupimage.create({
        groupId: parseInt(req.params.groupId),
        url: req.body.url,
        previewImg: req.body.preview
    }, {validate: true})

    delete newImage.dataValues.groupId
    newImage.dataValues.preview = newImage.dataValues.previewImg
    delete newImage.dataValues.previewImg
    delete newImage.dataValues.createdAt
    delete newImage.dataValues.updatedAt


    res.json(
        newImage
    )
    } catch (error) {
        error.message = "Bad Request"
        error.status = 400
        next(error)
        return
    }
})


//gets all the groups that belong to the current user or joined by current user include numMembers
router.get('/current', requireAuth, async (req, res) => {
    let arr = []
    const userId = req.user.dataValues.id
    const memberships = await Member.findAll({
        where: {
            userId,
            status: ['member', 'co-host']
        }
    })

    for (let i = 0; i < memberships.length; i++) {
        //find group info
        const group = await Group.findByPk(memberships[i].dataValues.groupId)
        //get numMembers
        const numMembers = await Member.count({
            where: {
                groupId: group.dataValues.id,
                status: ['member', 'co-host']
            }
        })
        //get previewImage
        const previewImage = await Groupimage.findOne({
            attributes: ['url'],
            where: {
                groupId: group.dataValues.id,
                previewImg: true
            }
        })
        //format date
        const createdAt = group.dataValues.createdAt
        const updatedAt = group.dataValues.updatedAt
        group.dataValues.createdAt = formatCandUDate(createdAt)
        group.dataValues.updatedAt = formatCandUDate(updatedAt)
        let obj = {...group.toJSON(), numMembers, previewImage: previewImage ? previewImage.url : null}
        arr.push(obj)
    }
    res.json({Groups: arr})
})

//gets details of a group from an id and numMembers and venues
router.get('/:groupId', async (req, res, next)=> {
    try {
        //finds group by id
    const groupId = parseInt(req.params.groupId)
    const group = await Group.findOne({
        where: {
            id: groupId,
        },
    })

    //formats Dates
    const createdAt = group.dataValues.createdAt
    const updatedAt = group.dataValues.updatedAt
    group.dataValues.createdAt = formatCandUDate(createdAt)
    group.dataValues.updatedAt = formatCandUDate(updatedAt)
    //counts number of members of group
    const numMembers = await Member.count({
        where: {
            groupId: groupId,
            status: ['member', 'co-host']
        }
    })

    //finds organizerInfo
    const organizerId = group.organizerId
    const organizerInfo = await User.findOne({
        attributes: {
            exclude: ['username']
        },
        where: {
            id: organizerId
        }
    })

    //finds all images of the group then puts into an array.
    let arr = []
    const images = await Groupimage.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'groupId']
        },
        where: {
            groupId : groupId,
        }
    })

    for (let i = 0; i < images.length; i++) {

        images[i].dataValues.preview = images[i].dataValues.previewImg
        delete images[i].dataValues.previewImg
        arr.push(images[i].dataValues)
    }
    //finds all Venues of the group the puts into an array
    let venueArr = []
    const venues = await Venue.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'groupId']
        },
        where: {
            groupId: groupId
        }
    })

    for (let i = 0; i < venues.length; i++) {
        venueArr.push(venues[i].dataValues)
    }

    //sends the response object.
    res.json({
        ...group.toJSON(), numMembers,
        GroupImages: arr,
        Organizer: organizerInfo,
        Venues: venueArr
    })
    //catches error
    } catch (error) {
        error.status = 404
        error.message = "Group does not exist"
        next(error)
    }
})

//gets all the groups info with numMembers and preview image
router.get('/', async (req, res) => {
    //gets all the groups
        let arr = []
        const groups = await Group.findAll()
    //gets numMember aggregate data and gets preview image, combines with group, then gets pushed into an array.
        for (let i = 0; i < groups.length; i++) {
        const createdAt = groups[i].dataValues.createdAt
        const updatedAt = groups[i].dataValues.updatedAt
        groups[i].dataValues.createdAt = formatCandUDate(createdAt)
        groups[i].dataValues.updatedAt = formatCandUDate(updatedAt)

        let obj = {...groups[i].toJSON()}
        //gets aggregate members
        const numMembers = await Member.count({
            where: {
                groupId: groups[i].dataValues.id,
                status: ['member', 'co-host']
            }
        })
        // gets preview image
        const previewImage = await Groupimage.findOne({
            attributes: ['url'],
            where: {
                groupId: groups[i].dataValues.id,
                previewImg: true
            }
        })
        //combines if previewImage exists
        if (previewImage) {
            obj.previewImage = previewImage.toJSON().url
        }
        obj.previewImage ? obj.previewImage : obj.previewImage = null
        obj.numMembers = numMembers
        arr.push(obj)
        }



    //returns the array
        res.json({Groups: arr})
    })


// edits a group, authenticated user, only owner of group can edit.

router.put('/:groupId', requireAuth, async (req, res, next) => {

    try {
        const groupId = parseInt(req.params.groupId)
        const userId = req.user.dataValues.id
        // find the group
        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })
        //check if group exists
        if (!group) {
            const err = new Error('Group group does not exist')
            err.status = 404
            next(err)
            return
        }


        //check if user owns the group.
        if (userId !== group.dataValues.organizerId) {
            const err = new Error('Correct autherization required. User must own the group.')
            err.status = 403
            next(err)
            return
        }
        //destructure updates from req body
        const { name, about, type, private, city, state } = req.body

        await group.update({
            name,
            about,
            type,
            private,
            city,
            state
        }, {validate: true})
        let formatCreatedAt = formatCandUDate(group.dataValues.createdAt)
        let formatUpdatedAt = formatCandUDate(group.dataValues.updatedAt)
        group.dataValues.createdAt = formatCreatedAt
        group.dataValues.updatedAt = formatUpdatedAt
        res.json(group)
    } catch (error) {
        error.message = "Validation error"
        error.status ? error.status : error.status = 400
        next(error)
    }

})

//deletes a group by id
router.delete('/:groupId',requireAuth, async (req, res, next) => {
    try {
        const groupId = parseInt(req.params.groupId)
        const userId = req.user.dataValues.id
        // find the group
        const group = await Group.findOne({
            where: {
                id: groupId
            }
        })
        //check if group exists
        if (!group) {
            const err = new Error('Group does not exist')
            err.status = 404
            next(err)
            return
        }
        const groupName = group.name
        //check if user owns the group.
        if (userId !== group.organizerId) {
            const err = new Error('Correct autherization require. User must own the group.')
            err.status = 403
            next(err)
            return
        }
        //deletes the group
        await Group.destroy( {
            where: {
                id: groupId
            }
        })
        res.json({
            message:  `Your group ${groupName} was successfully deleted.`
        })

    } catch (error) {
        next(error)
    }
})

//creates a new group, authentication required.
router.post('/',requireAuth, async (req, res, next) => {
    try {
    const newGroup = await Group.create({
        organizerId : req.user.dataValues.id,
        name: req.body.name,
        about: req.body.about,
        private: req.body.private,
        type: req.body.type,
        city: req.body.city,
        state: req.body.state
    })
    const newMember = await Member.create({
        userId: req.user.dataValues.id,
        groupId: newGroup.dataValues.id,
        status: 'member'
    })

    const fCreatedDate = formatCandUDate(newGroup.dataValues.createdAt)
    const fUpdatedDate = formatCandUDate(newGroup.dataValues.updatedAt)
    newGroup.dataValues.createdAt = fCreatedDate
    newGroup.dataValues.updatedAt = fUpdatedDate
    res.statusCode = 201
    res.json(newGroup)
} catch (error) {
    error.status = 400
    error.message = "Bad request"
    next(error)
}
})






module.exports = router
