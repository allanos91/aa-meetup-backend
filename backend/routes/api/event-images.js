const express = require('express');
const router = express.Router();
const { Eventimage, Group, Member } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');

//deletes event image specified by id
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    //check if image exists
    const eventImage = await Eventimage.findByPk(parseInt(req.params.imageId))
    if (!eventImage) {
        const err = new Error('Image does not exist')
        err.status = 404
        throw err
    }
    // check if user is organizer or co-host
    const event = await eventImage.getEvent()
    const group = await Group.findByPk(event.dataValues.groupId)
    const organizerId = group.dataValues.organizerId
    const isCohost = await Member.findOne({
        where: {
            userId: req.user.dataValues.id,
            groupId: group.dataValues.id,
            status: 'co-host'
        }
    })
    if (!(organizerId === req.user.dataValues.id || isCohost)) {
        const err = new Error('Must be organizer or co-host of group to delete image.')
        err.status = 403
        throw err
    }

    //delete event image
    await eventImage.destroy()
    res.json({
        message: "Event image successfully deleted"
    })
})



module.exports = router
