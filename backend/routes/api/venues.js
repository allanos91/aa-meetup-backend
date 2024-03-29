
const express = require('express');
const router = express.Router();
const { Group, Member, Venue } = require('../../db/models')
const { requireAuth }  = require('../../utils/auth');

router.put('/:venueId', requireAuth, async (req, res, next) => {
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
        throw err
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
        throw err
    }

    const { address, city, state, lat, lng } = req.body

    venue.set({
        address: address ? address : venue.dataValues.address,
        city: city ? city : venue.dataValues.city,
        state: state ? state: venue.dataValues.state,
        lat: lat ? lat : venue.dataValues.lat,
        lng: lng ? lng : venue.dataValues.lng
    })

    await venue.save()
    res.json(venue)
})






module.exports = router;
