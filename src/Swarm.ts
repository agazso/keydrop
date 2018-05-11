import { NativeModules } from 'react-native';
import { PrivateIdentity } from './models/Identity';

export const createIdentity = async (): Promise<PrivateIdentity> => {
    return JSON.parse(await NativeModules.Swarm.createIdentity()) as PrivateIdentity;
};
