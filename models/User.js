let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');
let is = require('is_js');
let properFormat = require('../helpers/properFormat');
let capitalizedFormat = require('../helpers/capitalizedFormat');
let isValidStateAbbreviation = require('../helpers/isValidStateAbbreviation');
mongoose.set('useFindAndModify', false);

let gmApi = require('@google/maps');

var gmClient = gmApi.createClient({
    key: process.env.GMAPS_API_KEY,
});

const userSchema = new Schema({
    email: { // is converted to lowercase in a pre save hook
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(e) {
                return is.email(e);
            },
            message: props => `${props.value()} is not a valid email!`
        }
    },
    password: { // is hashed in a pre save hook
        type: String,
        required: true
    },
    name: { // is proper formatted in a pre save hook
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    location: {
        address: String, // proper formatted in a pre save hook
        city: String, // proper formatted in a pre save hook
        state: { // capitalized in a pre save hook
            type: String, 
            minlength: 2,
            maxlength: 2,
            validate: {
                validator: function(st) {
                    return isValidStateAbbreviation(st.toUpperCase());
                },
                message: props => `${props.value} is not a valid state abbreviation!`
            }
        },      
        zip: { // can only be a us zip code at this point
            type: Number,
            validate: {
                validator: function(z) {
                    return is.usZipCode(z);
                },
                message: props => `${props.value} is not a valid US zip code!`
            }
        },
        lat: Number, // these two are calculated in a pre save hook using google maps
        long: Number // so not necessary to add them.
    },
    accountType: {
        type: String,
        enum: ['Contributor', 'Homeowner', 'Business Owner', 'System Admin']
    },
    blockedUsers: [{type: String, required: false}],
    blockedBy: [{type: String, required: false}],
    allowedItems: {type: String, required: false}, // this is capitalized (first letter only) in a pre save hook
    prohibitedItems: {type: String, required: false}, // this is capitalized (first letter only) in a pre save hook
    radius: {type: Number, required: true, default: 5, max: 100, min: 0.1},
    homeownerInfo: {
        required: false,
        meetingPlace: { // when the user document is saved for the first time, this will default to same as the location if it is not set
            address: String, // proper formatted in a pre save hook
            city: String, // proper formatted in a pre save hook
            state: { // capitalized in a pre save hook
                type: String,
                minlength: 2,
                maxlength: 2
            },
            zip: { // can only be a us zip code at this point
                type: Number,
                validate: {
                    validator: function(z) {
                        return is.usZipCode(z);
                    },
                    message: props => `${props.value} is not a valid US zip code!`
                }
            },
            lat: Number, // these are calculated in a pre save hook using google maps
            long: Number // so no need to calculate manually
        },
        isListingOn: {
            type: Boolean
        }
    },
    businessOwnerInfo: {
        required: false,
        isListingOn: {
            type: Boolean
        },
        businessName: String, // this is proper formatted in a pre-save hook
        businessWebsite: { // this url is converted to lowercase in a pre save hook
            type: String,
            required: false,
            validate: {
                validator: function(v) {
                    return is.url(v);
                },
                message: props => `${props.value} is not a valid website!`
            }
        },
        contributorCharge: {
            type: Number
        }
    }
}, 
{
    timestamps: true
});


// A pre-save hook for hashing the pwd
userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const pw = user.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pw, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    });
});

// a pre save hook for converting email to lowercase
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified("email")) {
        return next();
    }
    let email = user.email;
    user.email = email.toLowerCase();
    next();
});

// a pre save hook for proper formatting for the name
userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified("name")) {
        return next();
    }
    const first = user.name.first;
    const last = user.name.last;
    const firstFormatted = properFormat(first);
    const lastFormatted = properFormat(last);
    user.name.first = firstFormatted;
    user.name.last = lastFormatted;
    next();
});

// a pre save hook for getting the latitude and longitude and setting the meeting place to same as
// location if they are a homeowner and meeting place has not been set yet
userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified("location")) {
        return next();
    }

    // formatting the address properly
    let state = user.location.state;
    state = state.toUpperCase();
    user.location.state = state;

    const addr = user.location.address;
    user.location.address = properFormat(addr);

    const city = user.location.city;
    user.location.city = properFormat(city);

    gmQuery = gmClient.geocode({
        address: user.location.address + " " + user.location.city + " " + user.location.state + " " + user.location.zip
    }, function(err, response) {
        if (err) {
            console.log(err);
            return next(err);
        }
        else {
            user.location.lat = response.json.results[0].geometry.location.lat;
            user.location.long = response.json.results[0].geometry.location.lng;
            console.log("lat: " + user.location.lat + " long: " + user.location.long);
            next();
        }
    });
});

// a pre save hook for getting the latitude and longitude
// of the meeting place and proper formatting everything properly
userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified("homeownerInfo.meetingPlace")) {
        return next();
    }

    // formatting the address properly
    let state = user.homeownerInfo.meetingPlace.state;
    state = state.toUpperCase();
    user.homeownerInfo.meetingPlace.state = state;

    const addr = user.homeownerInfo.meetingPlace.address;
    user.homeownerInfo.meetingPlace.address = properFormat(addr);

    const city = user.homeownerInfo.meetingPlace.city;
    user.homeownerInfo.meetingPlace.city = properFormat(city);

    gmClient.geocode({
        address: user.homeownerInfo.meetingPlace.address + " " + user.homeownerInfo.meetingPlace.city + " " + user.homeownerInfo.meetingPlace.state + " " + user.homeownerInfo.meetingPlace.zip
    }, function(err, response) {
        if (err) {
            console.log(err);
            return next(err);
        }
        else {
            console.log(response.json.results[0].geometry);
            user.homeownerInfo.meetingPlace.lat = response.json.results[0].geometry.location.lat;
            user.homeownerInfo.meetingPlace.long = response.json.results[0].geometry.location.lng;
            console.log("lat: " + user.homeownerInfo.meetingPlace.lat + " long: " + user.homeownerInfo.meetingPlace.long);
        }
    });
    next();
});

// pre save hook for capitalizing allowed items
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified("allowedItems")) {
        return next();
    }
    let allowedItems = user.allowedItems;
    user.allowedItems = capitalizedFormat(allowedItems);
    next();
});

// pre save hook for capitalizing prohibited items
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified("prohibitedItems")) {
        return next();
    }
    let prohibited = user.prohibitedItems;
    user.prohibitedItems = capitalizedFormat(prohibited);
    next();
});

// pre save hook for proper formatting the business name
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified("businessOwnerInfo.businessName")) {
        return next();
    }
    let bName = user.businessOwnerInfo.businessName;
    user.businessOwnerInfo.businessName = properFormat(bName);
    next();
});

// pre save hook for lowercasing the business website url
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified("businessOwnerInfo.businessWebsite")) {
        return next();
    }
    let bWebsite = user.businessOwnerInfo.businessWebsite;
    user.businessOwnerInfo.businessWebsite = bWebsite.toLowercase();
    next();
});

// pre save for making sure all values are filled out in the db
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified("accountType")) {
        return next();
    }
    let accountType = user.accountType;
    if (accountType === "Homeowner") {
        if (is.not.existy(user.homeownerInfo.meetingPlace.address)) {
            user.homeownerInfo.meetingPlace = user.location;
        }
        if (is.not.existy(user.homeownerInfo.isListingOn)) {
            user.homeownerInfo.isListingOn = true;
        }
        if (is.not.existy(user.allowedItems)) {
            user.allowedItems = "";
        }
        if (is.not.existy(user.prohibitedItems)) {
            user.prohibitedItems = "";
        }
        user.businessOwnerInfo = null;
    }
    else if (accountType === "Business Owner") {
        if (is.not.existy(user.businessOwnerInfo.businessName)) {
            user.businessOwnerInfo.businessName = capitalizedFormat("Edit your business name");
        }
        if (is.not.existy(user.businessOwnerInfo.businessWebsite)) {
            user.businessOwnerInfo.businessWebsite = "https://www.google.com";
        }
        if (is.not.existy(user.businessOwnerInfo.isListingOn)) {
            user.businessOwnerInfo.isListingOn = true;
        }
        if (is.not.existy(user.businessOwnerInfo.contributorCharge)) {
            user.businessOwnerInfo.contributorCharge = 0;
        }
        if (is.not.existy(user.allowedItems)) {
            user.allowedItems = "";
        }
        if (is.not.existy(user.prohibitedItems)) {
            user.prohibitedItems = "";
        }
        user.homeownerInfo = null;
    }
    else if (accountType === "Contributor") {
        user.homeownerInfo = null;
        user.businessOwnerInfo = null;
    }
    next();
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
    var blockedUsersSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {blockedUsers: {$addToSet: blockedUser._id}}}, function(err, doc) {
        if (err) return false;
        else return true;
    });
    var blockedBySet = this.model('User').findOneAndUpdate({'_id': {$eq: blockedUser._id}}, {$set: {blockedBy: {$addToSet: this._id}}}, function(err, doc) {
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
    var homeownerInfoSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {'homeownerInfo': info}}, cb);
    return homeownerInfoSet;
};

/*
 * This method will set the business owner info when it receives an 'info' object
 * that has the keys: isListingOn, businessName, businessPhone, businessWebsite, and
 * businessHours with keys weekdayHours and weekendHours.
 */
userSchema.methods.addBusinessOwnerInfo = function(info, cb) {
    var businessOwnerInfoSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {'businessOwnerInfo': info}}, cb);
    return businessOwnerInfoSet;
};

/*
 * This method will set the contributor info when it receives an 'info' object
 * with key searchRadius
 */
userSchema.methods.addContributorInfo = function(info, cb) {
    var contributerInfoSet = this.model('User').findOneAndUpdate({'_id': {$eq: this._id}}, {$set: {'contributorInfo': info}}, cb);
    return contributerInfoSet;
};

/*
 * This method will check if the current user's validation token 
 * matches the token given, and will update the validated field if so
 * and return true.
 */
userSchema.statics.validateUser = async function(userId, token, cb) {
    var objectId = new mongoose.Types.ObjectId(userId);
    var updated = await this.findOneAndUpdate({'_id': objectId, 'validationToken': token}, {$set: {'validated': true}}, {new: true}, cb);
    return updated;
};


var userModel = mongoose.model('User', userSchema);

module.exports = userModel;