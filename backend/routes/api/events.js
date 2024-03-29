// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();
const { requireAuth }  = require('../../utils/auth');
const { Event } = require('../../db/models')

router.get('/', requireAuth, async (req, res, next) => {
    const events = await Event.findAll()

    res.json(events)
})




module.exports = router
