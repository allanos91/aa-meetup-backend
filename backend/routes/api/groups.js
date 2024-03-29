// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { Group, Member, User, Groupimage, Venue } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');

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
            throw new Error('Group not found')
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
            err.status = 400
            throw err
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

        console.log(newVenue)

        res.json(newVenue)
    } catch (error) {
        next(error)
    }
})


//Get all venues for a group specified by id.
router.get('/:groupId/venues', async (req, res, next) => {
    try {
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

        res.json(venues)
    } catch (error) {
        next(error)
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
        throw newErr
    }


    if (userId !== group.dataValues.organizerId) {
        const err = new Error('Must be organizer of group to post new image.')
        err.status = 400
        throw err
    }

    const newImage = await Groupimage.create({
        groupId: parseInt(req.params.groupId),
        url: req.body.url,
        previewImg: req.body.previewImg
    })


    res.json({
        url: newImage.url,
        groupId: newImage.groupId,
        previewImg: newImage.previewImg,
    })
    } catch (error) {
        next(error)
    }
})


//gets all the groups that belong to the current user
router.get('/current', async (req, res) => {
    const user = req.user
    const groups = await Group.findAll({
        where: {
            organizerId : user.dataValues.id
        }
    })
    res.json(groups)
})

//gets details of a group from an id and numMembers
router.get('/:groupId', async (req, res, next)=> {
    try {
        //finds group by id
    const groupId = parseInt(req.params.groupId)
    const group = await Group.findOne({
        where: {
            id: groupId,
        },
    })
    //counts number of members of group
    const numMembers = await Member.count({
        where: {
            groupId: groupId,
            status: 'member'
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
        arr.push(images[i].dataValues)
    }

    //sends the response object.
    res.json({
        groupInfo: {
        ...group.toJSON(), numMembers
        },
        groupImages: arr,
        organizerInfo: organizerInfo
    })
    //catches error
    } catch (error) {
        error.status = 404
        error.message = "Group does not exist"
        next(error)
    }
})

//gets all the groups info with numMembers
router.get('/', async (req, res) => {
    //gets all the groups
        let arr = []
        const groups = await Group.findAll()
    //gets numMember aggregate data and gets preview image, combines with group, then gets pushed into an array.
        for (let i = 0; i < groups.length; i++) {
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
        res.json(arr)
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
            throw err
        }
        //check if user owns the group.
        if (userId !== group.organizerId) {
            const err = new Error('Correct autherization require. User must own the group.')
            throw err
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
        res.json(group)
    } catch (error) {
        error.message ? error.message : "Invalid inputs"
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
            throw err
        }
        const groupName = group.name
        //check if user owns the group.
        if (userId !== group.organizerId) {
            const err = new Error('Correct autherization require. User must own the group.')
            throw err
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
        groupType: req.body.groupType,
        city: req.body.city,
        state: req.body.state
    })
    res.json(newGroup)
} catch (error) {
    error.status = 400
    error.message = "Missing or invalid inputs"
    next(error)
}
})






module.exports = router
