import {
    Platform,
} from 'react-native';

export const Colors = {
    BRAND_RED: '#FF4C65',
    BRAND_YELLOW: '#FFC33C',
    BRAND_BLUE: '#00C8F8',
    BRAND_GREEN: '#6DD002',
    BRAND_TEAL: '#59C4C5',
    BRAND_LIGHT_YELLOW: '#FBE2B4',
    BRAND_LIGHT_GREY: '#BDBBBB',
    BRAND_MEDIUM_GREY: '#666464',
    BRAND_VIOLET: '#5C1997',
    BRAND_ACTION_BLUE: '#157EFB',
    WHITE: '#FFFF',
    LIGHTISH_GRAY: '#9B9B9B',
    LIGHT_GRAY: '#D3D3D3',
    LIGHTER_GRAY: '#E6E6E6',
    VERY_LIGHT_GRAY: '#F8F8F8',
    GRAY: '#808080',
    DARK_GRAY: '#303030',
    DEFAULT_ACTION_COLOR: '#007AFF',
    STRONG_TEXT: '#303030',
    ATTENTION: '#D0021B',
    IOS_LIGHT_BLUE: '#54C7FC',
    IOS_YELLOW: '#FFCD00',
    IOS_ORANGE: '#FF9600',
    IOS_PINK: '#FF2851',
    IOS_DARK_BLUE: '#0076FF',
    IOS_GREEN: '#44DB5E',
    IOS_RED: '#FF3824',
    IOS_GRAY: '#8E8E93',
};

export const IconSize = {
    LARGE_LIST_ICON: 32,
    MEDIUM_LIST_ICON: 24,
    SMALL_LIST_ICON: 10,
};

export const HelveticaNeue = 'Helvetica Neue';
export const DefaultFont = HelveticaNeue;

export const Header = {
    PADDING: Platform.OS === 'ios' ? 20 : 0,
    HEIGHT: 60,
};

export const DefaultPadding = {
    HORIZONTAL: 10,
};

export const DefaultLabelColor = Colors.GRAY;
