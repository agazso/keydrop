import { NavigationAction } from 'react-navigation';

export type ActionsTypes =
    | CreateUserAction
    ;

export interface CreateUserAction {
    type: 'CREATE-USER';
    name: string;
}

export const createUser = (name: string): CreateUserAction => ({
    type: 'CREATE-USER',
    name: name,
});
