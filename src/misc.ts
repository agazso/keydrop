import { Platform, PlatformIOS } from 'react-native';

const getDeviceType = (): string => {
    switch (Platform.OS) {
        case 'ios': return PlatformIOS.isPad ? 'iPad' : 'iPhone';
        case 'android': return 'Android';
        case 'windows': return 'PC';
        case 'macos': return 'Mac';
        case 'web': return 'Browser';
    }
};

const getDeviceName = (username: string): string => {
    const suffix = username.endsWith('s') ? '\'' : '\'s';
    const deviceType = getDeviceType();
    return `${username}${suffix} ${deviceType}`;
};
