var	mongoose = require('mongoose');

var Schema = mongoose.Schema;

var missionSchema = new Schema ({
	name: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: false
	},
	type: {
		type: String,
		required: false
	},
	startDate: {
		type: Date,
		required: false
	},
	endDate: {
		type:Date,
		required: false
	},
	status: {
		type: String,
		required: false
	},
	visible: {
		type: Boolean,
		required: false
	},
	restrictedAccess: {
		type: Boolean,
		required: false
	},
	missionCommander: {
		type: String,
		required: false
	},
	location:{
		type: String,
		required: false
	}
});

var missionModel = mongoose.model('Mission', missionSchema);

var readMission = function(id) {
	return new Promise(function(resolve, reject) {
		if (id !== undefined) {
			missionModel.findOne({_id:id}, {__v:0}, function (err, mission) {
				if (err) {
					reject(err);
				} else {
					resolve(mission);
				}
			});
		} else {
			missionModel.find({}, {__v:0}, function (err, missions) {
				if (err) {
					reject(err);
				} else {
					resolve(missions);
				}
			});
		}
	});
};

module.exports = {
	readMission: readMission
};
