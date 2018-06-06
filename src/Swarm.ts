import { NativeModules } from 'react-native';
import { PrivateIdentity } from './models/Identity';

export const createIdentity = async (): Promise<PrivateIdentity> => {
    const identity = await NativeModules.Swarm.createIdentity() as PrivateIdentity;
    return identity;
};
