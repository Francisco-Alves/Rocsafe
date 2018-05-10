var express = require('express');
var router = express.Router();
var Mission = require('../models/missions.js');


// Read mission
router.get('/:id?', function (req, res) {
	Mission.readMission(req.params.id).
		then(function (missions) {
			res.json(missions);
		}).catch(function (err) {
			res.status(400).send(err);
		});
});

module.exports = router;
