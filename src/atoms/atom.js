import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const sidebarState = atom({
    key: 'sidebarState',
    default: false,
});

export const userInfoState = atom({
    key: 'userInfoState',
    default: {
        isLogIn: false,
        nickname: "",
        profile_picture: "",
        user_id: null,
        is_climate_card_eligible: true
    },
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
    effects_UNSTABLE: [persistAtom],
});

export const bookmarkState = atom({
    key: 'bookmarkState',
    default: false,
});

// 경로 상세 조회 요청에 대한 Response
export const routeResponseState = atom({
    key: 'routeResponseState',
    default: {},
    effects_UNSTABLE: [persistAtom],
});

// 아이디 찾기 요청에 대한 Response
export const findIdResponseState = atom({
    key: 'findIdResponseState',
    default: {},
    effects_UNSTABLE: [persistAtom],
});

// 비밀번호 재설정 요청에 대한 Response
export const resetPwResponseState = atom({
    key: 'resetPwResponseState',
    default: {},
    effects_UNSTABLE: [persistAtom],
});