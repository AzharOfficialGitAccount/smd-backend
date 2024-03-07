import { Document, Schema, Model, model } from 'mongoose';
export interface UserDocument extends Document {
    mobile?: number;
    email?: string;
    userName: string,
    password?: string;
    profilePic?: string;
    userStatus?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    jwt?: string[];
}

export enum userStatus {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

const userSchema: Schema<UserDocument> = new Schema({
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
    },
    mobile: {
        type: Number
    },
    password: {
        type: String
    },
    profilePic: {
        type: String
    },
    userStatus: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.USER,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    });

const User: Model<UserDocument> = model<UserDocument>('users', userSchema);

export default User;
