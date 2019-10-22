var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    address: {
        streetAddress: String,
        city: String,
        state: {
            type: String, 
            minlength: 2,
            maxlength: 2
        },      
        zip: Number
    },
    accountType: {
        type: String,
        enum: ['Contributor', 'Homeowner', 'Business Owner', 'System Admin']
    },
    birthday: {
        type: String, 
        validate: {
            validator: function(b) {
                return /\d{2}\/\d{2}\/\d{4}/.test(b)
            },
            message: props => props.value + ' is not a valid birthday!'
        }
    },
    validated: Boolean,
    validationToken: String,
    blockedUsers: [{ type : ObjectId, ref: 'User' }],
    blockedBy: [{ type : ObjectId, ref: 'User' }],
    homeownerInfo: {
        required: false,
        meetingPlace: {   
            streetAddress: String,
            city: String,
            state: String,
            zip: Number
        },
        acceptedMaterials: String,
        isListingOn: Boolean,
        display_radius: Number,
    },
    businessOwnerInfo: {
        required: false,
        acceptedMaterials: String,
        isListingOn: Boolean,
        businessName: String,
        businessPhone:Number,
        businessWebsite: String,
        businessHours: {
            weekdayHours: String,
            weekendHours: String
        }
    },
    contributorInfo: {
        required: false,
        searchRadius: Number
    }
}, 
{
    timestamps: true
});

/*
 * A pre-save hook for hashing the pwd
 */
userSchema.pre('save', function(next) {
    if (this.isModified("password")) {
        var pw = this.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(pw, salt, (err, hash) => {
                if (err) throw err;
                this.password = hash;
                next();
            })
        })
    }
    else {
        next();
    }
});

/*
 * This method will return the list of users blocked by this user
 */
userSchema.methods.findBlockedUsers = function(cb) {
    return this.model('User').find({'_id': {$in: this.blockedUsers}}, cb);
};

/*
 * This method will return the list of users this user is blocked by
 */
userSchema.methods.findBlockedBy = function(cb) {
    return this.model('User').find({'_id': {$in: this.blockedBy}}, cb);
};

/*
 * This method will block a user by taking a user to block (blocked) and will
 * both add that user's _id to this user's blockedUsers array and add this user's
 * _id to the blocked users blockedBy list
 */
userSchema.methods.blockUser = function(blocked, cb) {
    var blockedUser = this.model('User').find({'_id': blocked._id}, cb);
    var blockedUsersSet = this.model('User').findOneAndUpdate({'_id': this._id}, {$set: {blockedUsers: {$addToSet: blockedUser._id}}}, function(err, doc) {
        if (err) return false;
        else return true;
    });
    var blockedBySet = this.model('User').findOneAndUpdate({'_id': blockedUser._id}, {$set: {blockedBy: {$addToSet: this._id}}}, function(err, doc) {
        if (err) return false;
        else return true;
    });
    if(blockedUsersSet && blockedBySet) return true;
    else return false;
};

/*
 * This method will set the homeowner info when it receives an 'info' object
 * that has the keys: isListingOn, acceptedMaterials, displayRadius, and meetingPlace 
 * with keys streetAddress, city, state, and zip, 
 * 
 */
userSchema.methods.addHomeownerInfo = function(info, cb) {
    var homeownerInfoSet = this.model('User').findOneAndUpdate({'_id': this._id}, {$set: {'homeownerInfo': info}}, cb);
    return homeownerInfoSet;
};

/*
 * This method will set the business owner info when it receives an 'info' object
 * that has the keys: isListingOn, businessName, businessPhone, businessWebsite, and
 * businessHours with keys weekdayHours and weekendHours.
 */
userSchema.methods.addBusinessOwnerInfo = function(info, cb) {
    var businessOwnerInfoSet = this.model('User').findOneAndUpdate({'_id': this._id}, {$set: {'businessOwnerInfo': info}}, cb);
    return businessOwnerInfoSet;
};

/*
 * This method will set the contributor info when it receives an 'info' object
 * with key searchRadius
 */
userSchema.methods.addContributorInfo = function(info, cb) {
    var contributerInfoSet = this.model('User').findOneAndUpdate({'_id': this._id}, {$set: {'contributorInfo': info}}, cb);
    return contributerInfoSet;
};

/*
 * This method will execute a query to find a matching user with that userId. 
 * If it finds a user and the token matches the validationToken in the db, then 
 * it returns true and sets the validated attribute of that user to true. If it 
 * does not match, it does nothing to the validated attribute and returns false.
 */
userSchema.static.validate = function(userId, token, cb) {
    var user = this.model('User').find({'_id': userId}, function(err, usr) {
        if (err) throw err;
        else return usr;
    });

    if(user.validationToken == token) {
        this.model('User').findOneAndUpdate({'_id': user._id}, {$set: {'validated': true}}, cb);
        return true;
    }
    else {
        return false;
    }
};


var userModel = mongoose.model('User', userSchema);

module.exports = userModel;