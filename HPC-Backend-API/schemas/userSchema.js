const userSchema = mongoose.Schema({
    id : Number,
    username: String,
    password: String,
    email: String,
    name: {
        first: String,
        last: String
    },
    accountType: String,
    birthday: Date,
    blockedUsers: [{
        blockedUserId: Number
    }],
    blockedBy: [{
        blockingUserId: Number
    }],
    homeownerInfo: {
        name: {
            first: String,
            last: String
        },
        homeAddress: {
            streetAddress: String,
            city: String,
            state: String,       
            zip: Number
        },
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
        homeAddress: {
            streetAddress: String,
            city: String,
            state: String,       
            zip: Number
        },
        searchRadius: Number,
    }
}, 
{
    timestamps: true
});