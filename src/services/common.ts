import { Document, Model } from 'mongoose';

type Condition = Record<string, any>;

export async function create<T extends Document>(
    Model: Model<T>,
    details: Record<string, any>
): Promise<T | false> {
    try {
        const data = await new Model(details).save();
        return data as T;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function updateByCondition<T extends Document>(
    Model: Model<T>,
    condition: Condition,
    content: Record<string, any>
): Promise<T | false> {
    try {
        const data = await Model.findOneAndUpdate(condition, { $set: content }, { new: true });
        return data as T;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getByCondition<T extends Document>(
    Model: Model<T>,
    condition: Condition,
    projection: Record<string, any> = {}
): Promise<T | null | false> {
    try {
        const data = await Model.findOne(condition, projection).lean();
        return data ? (data as T) : null;
    } catch (error) {
        console.error(error);
        return false;
    }
}








