import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSetRecoilState, useRecoilState } from "recoil";
import { routeResponseState, climateCardState } from "../atoms/atom";
import { apiCall } from "../utils/Api";
import FavoriteRoute from "../components/SubwaySaveComp/FavoriteRoute";

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

const Section = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const Calendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const DateCell = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ isActive }) => (isActive ? "#E8F5E9" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#4CAF50" : "#666666")};
  cursor: pointer;
  border: ${({ isActive }) => (isActive ? "2px solid #4CAF50" : "1px solid #e0e0e0")};
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const RouteList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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
            if (response?.data?.data?.favorites) {
                setFavorites(response.data.data.favorites);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("즐겨찾기 데이터 가져오기 실패:", error);
        }
    };

    // 캘린더 날짜 데이터를 가져오는 함수
    const fetchCalendarDates = async () => {
        try {
            const response = await apiCall("get", `${import.meta.env.VITE_SERVER_URL}/subway/save/calendar`);
            if (response?.data?.data?.dates) {
                setCalendarDates(response.data.data.dates);
            } else {
                setCalendarDates([]);
            }
        } catch (error) {
            console.error("캘린더 데이터 가져오기 실패:", error);
        }
    };

    // 특정 날짜의 경로 데이터를 가져오는 함수
    const fetchRoutesByDate = async (date) => {
        try {
            const response = await apiCall("get", `${import.meta.env.VITE_SERVER_URL}/subway/save/calendar?date=${date}`);
            if (response?.data?.data?.routes) {
                setRoutes(response.data.data.routes);
            } else {
                setRoutes([]);
            }
        } catch (error) {
            console.error("날짜별 경로 데이터 가져오기 실패:", error);
        }
    };

    // 클릭 시 경로 상세 정보를 가져오는 함수
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

    // 특정 날짜 클릭 처리
    const handleDateClick = (date) => {
        setSelectedDate(date);
        fetchRoutesByDate(date);
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
                        <FavoriteRoute key={index} favorite={favorite} onClick={handleFavoriteClick} />
                    ))
                ) : (
                    <span>즐겨찾기된 경로가 없습니다</span>
                )}
            </FavoritesList>

            {/* 저장된 경로 보기
            <Section> */}
            <Title>저장된 경로 보기</Title>
            <p>날짜를 선택해주세요.</p>
            <Calendar>
                {Array.from({ length: 30 }).map((_, i) => {
                    const date = `2024-11-${String(i + 1).padStart(2, "0")}`;
                    const isActive = calendarDates.includes(date);
                    return (
                        <DateCell
                            key={date}
                            isActive={isActive}
                            onClick={() => isActive && handleDateClick(date)}
                        >
                            {i + 1}
                        </DateCell>
                    );
                })}
            </Calendar>
            {selectedDate && (
                <>
                    <Title>{selectedDate}</Title>
                    <RouteList>
                        {routes.length > 0 ? (
                            routes.map((route, index) => (
                                <FavoriteRoute key={index} favorite={route} onClick={handleFavoriteClick} />
                            ))
                        ) : (
                            <span>저장된 경로가 없습니다</span>
                        )}
                    </RouteList>
                </>

            )}
            {/* </Section> */}
        </Container>
    );
};

export default SubwaySavePage;
