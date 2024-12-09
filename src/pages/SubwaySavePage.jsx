import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSetRecoilState, useRecoilState } from "recoil";
import { routeResponseState, climateCardState } from "../atoms/atom";
import { apiCall } from "../utils/Api";
import FavoriteRoute from "../components/SubwaySaveComp/FavoriteRoute";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  padding-top: 50px;
  min-width: 320px;
  background-color: #ffffff;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  color: #333333;
  margin: 1rem 0;
  font-weight: bold;
  align-self: flex-start;
`;

const FavoritesList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const RouteList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledCalendar = styled(Calendar)`
  margin-top: 1rem;
  width: 100%;
  border: none;

  .react-calendar__tile {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s, color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .react-calendar__tile--active {
    background-color: #e8f5e9;
    color: #4caf50;
    border: 2px solid #4caf50;
  }

  .react-calendar__tile--highlight {
    background-color: #ffeb3b; /* 노란색 배경 */
    color: #333333;
    border: 2px solid #fbc02d;
  }

  .react-calendar__tile--selected {
    background-color: #4d7eff; /* 파란색 배경 */
    color: white;
    border: 2px solid #4d7eff;
  }
`;

const SubwaySavePage = () => {
    const [favorites, setFavorites] = useState([]);
    const [calendarDates, setCalendarDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [routes, setRoutes] = useState([]);
    const setRouteResponse = useSetRecoilState(routeResponseState);
    const [hasClimateCard, setHasClimateCard] = useRecoilState(climateCardState);

    // 즐겨찾기 데이터를 가져오는 함수
    const fetchFavorites = async () => {
        try {
            const response = await apiCall("get", `${import.meta.env.VITE_SERVER_URL}/subway/save/favorite`);
            setFavorites(response?.data?.data?.favorites || []);
        } catch (error) {
            console.error("즐겨찾기 데이터 가져오기 실패:", error);
        }
    };

    // 캘린더 날짜 데이터를 가져오는 함수
    const fetchCalendarDates = async () => {
        try {
            const response = await apiCall("get", `${import.meta.env.VITE_SERVER_URL}/subway/save/calendar`);
            setCalendarDates(response?.data?.data?.dates || []);
        } catch (error) {
            console.error("캘린더 데이터 가져오기 실패:", error);
        }
    };

    // 특정 날짜의 경로 데이터를 가져오는 함수
    const fetchRoutesByDate = async (date) => {
        try {
            const response = await apiCall("get", `${import.meta.env.VITE_SERVER_URL}/subway/save/calendar?date=${date}`);
            setRoutes(response?.data?.data?.routes || []);
        } catch (error) {
            console.error("날짜별 경로 데이터 가져오기 실패:", error);
        }
    };

    // 즐겨찾기 클릭 처리 함수
    const handleFavoriteClick = async (favorite) => {
        const postData = {
            start_station_name: favorite.start_station_name,
            end_station_name: favorite.end_station_name,
            is_climate_card_eligible: favorite.is_climate_card_eligible,
        };

        try {
            const response = await apiCall("post", `${import.meta.env.VITE_SERVER_URL}/subway/detail/search`, postData);
            const processedData = response.data.data || {};
            setRouteResponse(processedData);
            setHasClimateCard(favorite.is_climate_card_eligible);
            window.location.href = "/subway/route";
        } catch (error) {
            console.error("경로 상세 데이터 요청 실패:", error);
        }
    };

    const handleDeleteFavorite = async (favorite) => {
        const postData = { id: favorite.id };

        try {
            const response = await apiCall(
                "delete",
                `${import.meta.env.VITE_SERVER_URL}/subway/save/favorite/delete`,
                postData
            );

            if (response.data.status === "success") {
                setFavorites((prevFavorites) => prevFavorites.filter((f) => f.id !== favorite.id));
            }
        } catch (error) {
            console.error("즐겨찾기 삭제 요청 실패:", error);
        }
    };

    // 날짜를 로컬 시간 기준으로 YYYY-MM-DD 형식으로 변환
    const formatDateToLocal = (date) => {
        const offset = date.getTimezoneOffset() * 60000; // 로컬과 UTC 간의 밀리초 차이
        const localDate = new Date(date.getTime() - offset); // UTC 기준 밀리초에서 오프셋 제거
        return localDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식 반환
    };

    // 날짜 선택 처리 함수
    const handleDateChange = (date) => {
        const formattedDate = formatDateToLocal(date); // 로컬 시간 기준으로 날짜 포맷
        setSelectedDate(formattedDate); // 선택된 날짜 업데이트
        fetchRoutesByDate(formattedDate); // 해당 날짜의 경로 데이터를 가져옴
    };

    // 캘린더 삭제
    const handleDeleteCalendar = async (route) => {
        const postData = { id: route.id };

        try {
            const response = await apiCall(
                "delete",
                `${import.meta.env.VITE_SERVER_URL}/subway/save/calendar/delete`,
                postData
            );

            if (response.data.status === "success") {
                setRoutes((prevRoutes) => prevRoutes.filter((r) => r.id !== route.id));
            }
        } catch (error) {
            console.error("삭제 요청 실패:", error);
        }
    };

    useEffect(() => {
        fetchFavorites();
        fetchCalendarDates();
    }, []);

    return (
        <Container>
            {/* 즐겨찾기 경로 보기 */}
            <Title>즐겨찾기 경로 보기</Title>
            <FavoritesList>
                {favorites.length > 0 ? (
                    favorites.map((favorite, index) => (
                        <FavoriteRoute
                            key={index}
                            favorite={favorite}
                            onClick={handleFavoriteClick}
                            isDeletable={true} // 삭제 가능 여부 추가
                            onDelete={() => handleDeleteFavorite(favorite)} // 삭제 함수 추가
                        />
                    ))
                ) : (
                    <span>즐겨찾기된 경로가 없습니다</span>
                )}
            </FavoritesList>


            {/* 캘린더와 저장된 경로 보기 */}
            <Title>저장된 경로 보기</Title>
            <StyledCalendar
                onChange={handleDateChange}
                value={selectedDate ? new Date(selectedDate) : new Date()} // 클릭한 날짜 설정
                tileClassName={({ date }) => {
                    const formattedDate = formatDateToLocal(date);
                    if (formattedDate === selectedDate) {
                        return "react-calendar__tile--selected"; // 클릭된 날짜
                    }
                    if (calendarDates.includes(formattedDate)) {
                        return "react-calendar__tile--highlight"; // 저장된 경로가 있는 날짜
                    }
                    return null;
                }}
            />
            {selectedDate && (
                <>
                    <Title>{selectedDate}</Title>
                    <RouteList>
                        {routes.length > 0 ? (
                            routes.map((route, index) => (
                                <FavoriteRoute
                                    key={index}
                                    favorite={route}
                                    onClick={handleFavoriteClick}
                                    isDeletable={true}
                                    onDelete={() => handleDeleteCalendar(route)}
                                />
                            ))
                        ) : (
                            <span>저장된 경로가 없습니다</span>
                        )}
                    </RouteList>
                </>
            )}
        </Container>
    );
};

export default SubwaySavePage;
