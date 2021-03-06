var	mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Enumerations
/*
var staffSkills = new Schema ({
	skill: {
		type: String,
		required: true
	}
});

var languages = new Schema ({
	language: {
		type: String,
		required: true
	}
});

var userStatus = new Schema ({
	status: {
		type: String,
		required: true
	}
});*/

var userSchema = new Schema ({
	active: {
		type: Boolean,
		required: false
	},
	username: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	gender: {
		type:String,
		required: false
	},
	birthday: {
		type: Date,
		required: false /*true*/
	},
	phone: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true
		//unique: true
	},
	photo: {
		type: String,
		//data: Buffer,
		//contentType: String,
		required: false
	},
	description:{
		type: String,
		required: false
	},
	nationality: {
		type: [],
		required: false
	},
	skills: {
		type: [],
		required: false
	},
	nativeLanguage: {
		type: [],
		required: false
	},
	spokenLanguage: {
		type: [],
		required: false
	},
	systemLanguage: {
		type: [],
		required: false
	},
	status: {
		type: String,
		required: false
	},
	visibility: {
		type: Boolean,
		required: false
	},
	details: {
		type: Boolean,
		required: true,
		default: false
	},
	missionsList:{
		type: Array,
		required: false
	}
});

var userModel = mongoose.model('User', userSchema);

var createUser = function(user) {
	return new Promise(function(resolve, reject) {
		userModel.create(user, function (err, user) {
			if (err) {
				reject(err);
			} else {
				user.id = user._id;
				delete user.__v;
				delete user._id;
				resolve(user);
			}
		});
	});
};

var readUser = function(id) {
	return new Promise(function(resolve, reject) {
		if (id !== undefined) {
			userModel.findOne({_id:id}, {__v:0}, function (err, mission) {
				if (err) {
					reject(err);
				} else {
					resolve(mission);
				}
			});
		} else {
			userModel.find({}, {__v:0}, function (err, missions) {
				if (err) {
					reject(err);
				} else {
					resolve(missions);
				}
			});
		}
	});
};

var updateUser = function(id, user) {
	return new Promise(function(resolve, reject) {
		userModel.findByIdAndUpdate(id, user, {new:true}, function (err, user) {
			if (err) {
				reject(err);
			} else {
				user.id = user._id;
				delete user.__v;
				delete user._id;
				resolve(user);
			}
		});
	});
};

var deleteUser = function(id) {
	return new Promise(function(resolve, reject) {
		userModel.remove({_id:id}, function (err, userRes) {
			if (err) {
				reject(err);
			} else {
				resolve(userRes);
			}
		});
	});
};


module.exports = {
	createUser: createUser,
	readUser: readUser,
	updateUser: updateUser,
	deleteUser: deleteUser
};
