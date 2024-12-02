import axios from "axios";

export const refreshAccessToken = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/auth/refresh-token`
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
            return false;
        }
    } catch (error) {
        console.error("Access Token 갱신 중 에러 발생:", error);
        return false;
    }
};


export const apiCall = async (method, endpoint, data = null) => {
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
            const isRefreshed = await refreshAccessToken();
            if (isRefreshed) {
                const retryResponse = await apiCall(method, endpoint, data); // 재귀 호출로 요청 재시도
                return retryResponse;
            } else {
                console.log("로그인 필요");
                window.location.href = "/auth/login";
            }
        } else {
            console.error("API 요청 실패:", error);
            throw error;
        }
    }
};
