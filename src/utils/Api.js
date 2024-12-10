import axios from "axios";

export const refreshAccessToken = async (setUserInfo) => {
    const refresh = localStorage.getItem("refreshToken"); // localStorage에서 가져오기
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/auth/refresh-token`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Refresh-Token": refresh, // 항상 localStorage에서 가져온 토큰 사용
                },
            }
        );

        if (response.status === 200) {
            const authorizationHeader = response.headers.authorization;
            if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
                const accessToken = authorizationHeader.split(" ")[1];
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                localStorage.setItem("accessToken", accessToken); // localStorage에 저장
                console.log("Access Token 갱신 성공");
                return true;
            } else {
                console.error("Authorization 헤더가 유효하지 않습니다.");
                return false;
            }
        } else {
            console.log("Refresh Token이 만료되었거나 유효하지 않음");

            console.log("강제 로그아웃")

            // 로컬 스토리지 및 Axios 헤더 초기화
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            axios.defaults.headers.common["Authorization"] = "";

            // Recoil 상태 초기화
            if (setUserInfo) {
                setUserInfo((prev) => ({
                    ...prev,
                    isLogIn: false,
                    nickname: "",
                    profile_picture: "",
                    user_id: null,
                }));
            }

            window.location.href = "/auth/login";
            return false;
        }
    } catch (error) {
        console.error("Access Token 갱신 중 에러 발생:", error);
        return false;
    }
};

export const apiCall = async (method, endpoint, data = null, setUserInfo = null) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // localStorage에서 가져오기
        const response = await axios({
            method,
            url: endpoint,
            data,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // 항상 localStorage에서 가져온 토큰 사용
            },
        });

        console.log("API 응답:", response);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("Access Token이 만료됨, 갱신 시도");
            const isRefreshed = await refreshAccessToken(setUserInfo);
            if (isRefreshed) {
                const retryResponse = await apiCall(method, endpoint, data, setUserInfo); // 재귀 호출로 요청 재시도
                return retryResponse;
            } else {
                console.log("로그인 필요");

                console.log("강제 로그아웃")
                // 로컬 스토리지 및 Axios 헤더 초기화
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                axios.defaults.headers.common["Authorization"] = "";

                // Recoil 상태 초기화
                if (setUserInfo) {
                    setUserInfo((prev) => ({
                        ...prev,
                        isLogIn: false,
                        nickname: "",
                        profile_picture: "",
                        user_id: null,
                    }));
                }
                window.location.href = "/auth/login";
            }
        } else {
            console.error("API 요청 실패:", error);
            throw error;
        }
    }
};

export const logoutUser = async (setUserInfo, setSidebar = null, navigate) => {
    try {
        // /auth/logout API 요청
        const response = await apiCall("post", `${import.meta.env.VITE_SERVER_URL}/auth/logout`);
        if (response.status === 200) {
            console.log("로그아웃 성공");

            // 로컬 스토리지 및 Axios 헤더 초기화
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            axios.defaults.headers.common["Authorization"] = "";

            // Recoil 상태 초기화
            setUserInfo((prev) => ({
                ...prev,
                isLogIn: false,
                nickname: "",
                profile_picture: "",
                user_id: null,
            }));

            alert("로그아웃되었습니다.");

            // 사이드바 닫기 (setSidebar가 전달된 경우에만 실행)
            if (setSidebar) {
                setSidebar(false);
            }

            // 로그인 페이지로 리다이렉트
            navigate("/subway/search");
        }
    } catch (error) {
        console.error("로그아웃 요청 실패:", error);
        console.log("강제 로그아웃")
        // 로컬 스토리지 및 Axios 헤더 초기화
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        axios.defaults.headers.common["Authorization"] = "";

        // Recoil 상태 초기화
        if (setUserInfo) {
            setUserInfo((prev) => ({
                ...prev,
                isLogIn: false,
                nickname: "",
                profile_picture: "",
                user_id: null,
            }));
        }
        window.location.href = "/auth/login";
    }
};
