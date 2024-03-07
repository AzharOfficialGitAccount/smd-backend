import bcrypt from 'bcrypt';
import { env } from '../constant/environment';

let saltRounds: number | string = env.SALT_ROUND || 'defaultSaltRounds';

export const generateHash = async (password: string): Promise<string | Error> => {
    try {
        saltRounds = parseInt(saltRounds as string);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password.toString(), salt);
        return hash;
    } catch (err) {
        return <any>err;
    }
};

export const comparePassword = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);
