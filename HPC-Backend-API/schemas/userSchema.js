var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var autoIncrement = require('mongoose-auto-increment');

// autoIncrement.initialize(mongoose.connection);

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
    homeAddress: {
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
        enum: ['Contributor', 'Homeowner', 'Business Owner']
    },
    birthday: {
        type: String, 
        validate: {
            validator: function(b) {
                return /\d{2}\/\d{2}\/\d{4}/.test(b)
            },
            message: props => '${props.value} is not a valid birthday!'
        }
    },
    blockedUsers: [Number],
    blockedBy: [Number],
    homeownerInfo: {
        meetingPlace: {   
            streetAddress: String,
            city: String,
            state: String,
            zip: Number
        },
        acceptedMaterials: String,
        isListingOn: Boolean,
        display_radius: Number,
        approx_radius: Number
    },
    businessOwnerInfo: {
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
        searchRadius: Number
    }
}, 
{
    timestamps: true
});

//userSchema.plugin(autoIncrement.plugin, 'User');

var userModel = mongoose.model('User', userSchema);
