import { Document, Schema, model } from 'mongoose';
interface SessionDocument extends Document {
    userId: string;
    deviceId: string;
    deviceToken: string;
    deviceType: string;
    accessToken: string;
}

const SessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    deviceToken: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
});

const Session = model<SessionDocument>('Session', SessionSchema);

export { Session, SessionDocument };
