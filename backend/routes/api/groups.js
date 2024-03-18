// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { Group, Member, User } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');
const { or } = require('sequelize');
const group = require('../../db/models/group');



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

//gets details of a group from an id.
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
    res.json({
        groupInfo: {
        ...group.toJSON(), numMembers
        },
        organizerInfo: organizerInfo
    })
    } catch (error) {
        error.status = 404
        error.message = "Group does not exist"
        next(error)
    }

})

//gets all the groups with numMembers and image
router.get('/', async (req, res) => {
    //gets all the groups
        let arr = []
        const groups = await Group.findAll()
    //gets numMember aggregate data, combines with group, then gets pushed into an array.
        for (let i = 0; i < groups.length; i++) {
        let obj = {...groups[i].toJSON()}
        const numMembers = await Member.count({
            where: {
                groupId: groups[i].dataValues.id,
                status: 'member'
            }
        })
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
        await group.destroy()

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
