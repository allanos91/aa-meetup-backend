const express = require('express');
const router = express.Router();
const { Groupimage, Member } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');

//deletes a group image
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    //check if image exists
    const groupImage = await Groupimage.findByPk(parseInt(req.params.imageId))
    if (!groupImage) {
        const err = new Error('Image does not exist')
        err.status = 404
        throw err
    }

    //check if user is organizer or co-host
    const group = await groupImage.getGroup()
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

    //delete group image
     await groupImage.destroy()

    res.json({
        message: "Group image successfully deleted"
    })
})



module.exports = router
