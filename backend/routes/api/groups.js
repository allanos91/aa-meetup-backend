// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { Group } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth')



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


// //edits a group, authenticated user, only owner of group can edit.

router.put('/:groupId', requireAuth, async (req, res, next) => {
    // check if user owns the group
    const groupId = req.params.groupId
    console.log(typeof groupId)
    res.json("you hit the router!")
})



//creates a new group, authentication required.
router.post('/',requireAuth, async (req, res) => {
    const newGroup = await Group.create({
        organizerId : req.user.dataValues.id,
        name: req.body.name,
        about: req.body.about,
        groupType: req.body.groupType,
        city: req.body.city,
        state: req.body.state
    })
    res.json(newGroup)
})

//gets all the groups
router.get('/', async (req, res) => {
const groups = await Group.findAll()
res.json(groups)
})




module.exports = router
