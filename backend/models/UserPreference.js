import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
    applicationUrl: {
        type: String,
        required: [true, 'Application URL is required'],
        unique: true,
        trim: true,
        index: true,
    },
    taskType: {
        type: String,
        required: [true, 'Task type is required'],
        enum: ['green', 'balanced', 'performance'],
        default: 'green',
    },
    provider: {
        type: String,
        required: [true, 'Cloud provider is required'],
        enum: ['AWS', 'GCP'],
    },
    selectedZones: {
        type: [String],
        required: [true, 'At least one zone must be selected'],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'selectedZones must contain at least one region code',
        },
    },
    serverMap: {
        type: Map,
        of: String,
        default: new Map(),
        // Maps region codes to server URLs, e.g. { "ca-central-1": "http://3.99.xx.xx:3000" }
    },
}, {
    timestamps: true,
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;
