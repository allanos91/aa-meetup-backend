
const express = require('express');
const router = express.Router();
const { Group, Member, Venue } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');

router.put('/:venueId', requireAuth, async (req, res, next) => {
    try {
        //finds venue by id
    const venueId = parseInt(req.params.venueId)
    const venue = await Venue.findOne({
        where: {
            id: venueId
        }
    })

    //check if venue exists
    if (!venue) {
        const err = new Error("Venue was not found.")
        err.status = 404
        next(err)
        return
    }

    //check if user is co-host or organizer
    const group = await venue.getGroup();
    const isCohost = await Member.findOne({
        where: {
            userId : req.user.dataValues.id,
            groupId: group.dataValues.id,
            status: 'co-host'
        }
    })

    if (!(req.user.dataValues.id === group.dataValues.organizerId || isCohost)) {
        const err = new Error("Must be organizer or co-host to edit group.")
        err.status = 400
        next(err)
        return
    }

    const { address, city, state, lat, lng } = req.body


    await venue.update({
        address,
        city,
        state,
        lat,
        lng
    })

    delete venue.dataValues.createdAt
    delete venue.dataValues.updatedAt
    res.json(venue)
    } catch (error) {
        error.message = "Bad Request"
        error.status = 401
        next(error)
    }

})






module.exports = router;
