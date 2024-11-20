import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const sidebarState = atom({
    key: 'sidebarState',
    default: false,
});

export const loginState = atom({
    key: 'loginState',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

export const startStationState = atom({
    key: 'startStationState',
    default: "",
})

export const endStationState = atom({
    key: 'endStationState',
    default: "",
})

export const climateCardState = atom({
    key: 'climateCardState',
    default: false,
});

export const bookmarkState = atom({
    key: 'bookmarkState',
    default: false,
});