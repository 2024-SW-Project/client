import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa6";
import TransferInfo from '../components/SubwayRouteComp/TransferInfo';
import StationDetailInfo from '../components/SubwayRouteComp/StationDetailInfo';
import { bookmarkState, startStationState, endStationState, climateCardState, routeResponseState, userInfoState } from '../atoms/atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { apiCall } from '../utils/Api';
import CalendarModal from '../components/SubwayRouteComp/CalendarModal';

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

const TopContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #E0E0E0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
`;

const TimeContainer = styled.div`
    padding: 0 1rem;
`

const TimeText = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: #333;
`;

const TransferText = styled.div`
    font-size: 1rem;
    color: #666;
`;

const IconsContainer = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const BookmarkFIcon = styled(FaRegStar)`
    font-size: 1.5rem;
    cursor: pointer;
`;

const BookmarkTIcon = styled(FaStar)`
    color: orange;
    font-size: 1.5rem;
    cursor: pointer;
`;

const CalendarIcon = styled(FaRegCalendar)`
    font-size: 1.5rem;
    cursor: pointer;
`;

const SubwayRoutePage = () => {
    const [isBookmark, setIsBookmark] = useRecoilState(bookmarkState);
    const [startStation, setStartStation] = useRecoilState(startStationState);
    const [endStation, setEndStation] = useRecoilState(endStationState);
    const hasClimateCard = useRecoilValue(climateCardState);
    const routeResponse = useRecoilValue(routeResponseState);
    const [userInfo, setUserInfo] = useRecoilState(userInfoState);

    const [travelTime, setTravelTime] = useState(0);
    const [transferCount, setTransferCount] = useState(0);
    const [favoriteId, setFavoriteId] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const calculateTravelTime = (departure, arrival) => {
        const [depHour, depMinute] = departure.split(':').map(Number);
        const [arrHour, arrMinute] = arrival.split(':').map(Number);

        const depTotalMinutes = depHour * 60 + depMinute;
        const arrTotalMinutes = arrHour * 60 + arrMinute;

        return arrTotalMinutes - depTotalMinutes;
    };

    const getLineColor = (lineNumber) => {
        const lineColors = {
            "1호선": "#0052A4",
            "2호선": "#00A84D",
            "3호선": "#EF7C1C",
            "4호선": "#00A5DE",
            "5호선": "#996CAC",
            "6호선": "#CD7C2F",
            "7호선": "#747F00",
            "8호선": "#EA545D",
            "9호선": "#BDB092",
            "경의중앙선": "#77C4A3",
            "경춘선": "#0C8E72",
            "수인분당선": "#FABE00",
            "경강선": "#003DA5",
            "서해선": "#8FC31F",
            "우이신설선": "#B7C452",
            "신림선": "#6789CA",
            "인천1호선": "#6CA8DE",
            "인천2호선": "#ED8000",
            "인천국제공항철도": "#4E8FC6",
            "신분당선": "#D31145",
            "GTX-A": "#7D589F",
            "에버라인": "#F5A200",
            "의정부경전철": "#FDA600",
            "김포골드라인": "#986DB2",
        };

        return lineColors[lineNumber] || '#333';
    };

    const getLineNumber = (lineNumberText) => {
        const lineNumber = {
            "1호선": "1",
            "2호선": "2",
            "3호선": "3",
            "4호선": "4",
            "5호선": "5",
            "6호선": "6",
            "7호선": "7",
            "8호선": "8",
            "9호선": "9",
            "경의중앙선": "경의중앙",
            "경춘선": "경춘",
            "수인분당선": "수인분당",
            "경강선": "경강",
            "서해선": "서해",
            "우이신설선": "우이",
            "신림선": "신림",
            "인천1호선": "인천1",
            "인천2호선": "인천2",
            "인천국제공항철도": "공항철도",
            "신분당선": "신분당",
            "GTX-A": "GTX-A",
            "에버라인": "에버라인",
            "의정부경전철": "의정부경전철",
            "김포골드라인": "김포골드라인",
        };

        return lineNumber[lineNumberText] || '#333';
    };

    const convertSecondsToMinutes = (seconds) => {
        return Math.round(seconds / 60);
    };

    // 즐겨찾기 데이터를 가져오는 함수
    const fetchFavorites = async (userInfo, start_station_name, end_station_name, hasClimateCard) => {
        const postData = {
            "user_id": userInfo.user_id,
            "start_station_name": start_station_name,
            "end_station_name": end_station_name,
            "is_climate_card_eligible": hasClimateCard
        };

        try {
            const response = await apiCall("post", `${import.meta.env.VITE_SERVER_URL}/subway/detail/favorites/check`, postData, setUserInfo);
            if (response?.data?.favorite_route) {
                setIsBookmark(true);
                setFavoriteId(response.data.favorite_id);
            } else {
                setIsBookmark(false);
            }
        } catch (error) {
            console.error("즐겨찾기 데이터 가져오기 실패:", error);
        }
    };

    const handlePostFavorite = async (userInfo, routeResponse, hasClimateCard, setUserInfo) => {
        const postData = {
            "user_id": userInfo.user_id,
            "start_station_name": routeResponse.pathInfo.start_station_name,
            "end_station_name": routeResponse.pathInfo.end_station_name,
            "is_climate_card_eligible": hasClimateCard
        };

        try {
            const response = await apiCall("post", `${import.meta.env.VITE_SERVER_URL}/subway/detail/favorites`, postData, setUserInfo);
            if (response.data.message === "Route added to favorites successfully") {
                setIsBookmark(true);
            } else {
                setIsBookmark(false);
            }
        } catch (error) {
            console.error("즐겨찾기 요청 실패:", error);
        }
    }

    const handleDeleteFavorite = async (favoriteId, setUserInfo) => {
        const postData = {
            id: favoriteId
        };

        try {
            const response = await apiCall("delete", `${import.meta.env.VITE_SERVER_URL}/subway/save/favorite/delete`, postData, setUserInfo);
            if (response.data.status === "success") {
                setIsBookmark(false);
            } else {
                setIsBookmark(true);
            }
        } catch (error) {
            console.error("즐겨찾기 해제요청 실패:", error);
        }
    }


    const handleOpenCalendar = () => {
        setIsCalendarOpen(true);
    };

    const handleSaveToCalendar = async (data) => {
        try {
            const postData = {
                user_id: userInfo.user_id,
                start_station_name: routeResponse.pathInfo.start_station_name,
                end_station_name: routeResponse.pathInfo.end_station_name,
                is_climate_card_eligible: hasClimateCard,
                scheduled_date: data.scheduled_date,
                day_type: data.day_type,
                reminder_time: data.reminder_time,
            };

            const response = await apiCall("post", `${import.meta.env.VITE_SERVER_URL}/subway/detail/calendar`, postData);
            if (response.status === 201) {
                alert("캘린더에 경로가 저장되었습니다.");
            }
        } catch (error) {
            console.error("캘린더 저장 요청 실패:", error);
            alert("캘린더 저장에 실패했습니다. 다시 시도해주세요.");
        }
        setIsCalendarOpen(false);
    };

    useEffect(() => {
        console.log('hasClimateCard:', hasClimateCard);
        console.log('routeResponse:', routeResponse);

        setStartStation(routeResponse.pathInfo.start_station_name);
        setEndStation(routeResponse.pathInfo.end_station_name);
        setIsBookmark(routeResponse.pathInfo.is_favorite_route);
        setIsBookmark(routeResponse.pathInfo.is_favorite_route || false);
        setTravelTime(routeResponse.pathInfo.travel_time);
        setTransferCount(routeResponse.exChangeInfoSet.exChangeInfo.length);

        fetchFavorites(userInfo, routeResponse.pathInfo.start_station_name, routeResponse.pathInfo.end_station_name, hasClimateCard);
    }, []);

    return (
        <Container>
            {/* 소요시간 정보 */}
            <TopContainer>
                <TimeContainer>
                    <TimeText>{travelTime}분</TimeText>
                    <TransferText>환승 {transferCount}회</TransferText>
                </TimeContainer>
                {/* 즐겨찾기, 캘린더 아이콘 */}
                <IconsContainer>
                    {isBookmark ? <BookmarkTIcon onClick={() => handleDeleteFavorite(favoriteId, setUserInfo)} /> : <BookmarkFIcon onClick={() => handlePostFavorite(userInfo, routeResponse, hasClimateCard, setUserInfo)} />}
                    <CalendarIcon onClick={handleOpenCalendar} />
                </IconsContainer>
            </TopContainer>

            {/* 캘린더 모달 */}
            {isCalendarOpen && (
                <CalendarModal
                    onClose={() => setIsCalendarOpen(false)}
                    onSave={handleSaveToCalendar}
                />
            )}

            {/* 경로 세부 정보 */}
            {routeResponse.onStationSet.station.map((station, index) => (
                <React.Fragment key={index}>
                    <StationDetailInfo
                        startTime={station.departure_time}
                        startStation={station.start_station_name}
                        startLineNumber={getLineNumber(station.line_name)}
                        startLineColor={getLineColor(station.line_name)}
                        startDirection={
                            station.station_name_list[0]
                                ? station.station_name_list[0]
                                : station.way_station_name
                        }
                        stationsPathList={station.station_name_list}
                        stationsPathTime={station.time}
                        endTime={station.arrival_time}
                        endStation={station.way_station_name}
                        endDoorInfo={
                            Math.random() > 0.5 ? "내리는문 오른쪽" : "내리는문 왼쪽"
                        } // 랜덤 값
                        wayCode={station.way_code}
                        express={station.express}
                        fastTrainInfo={
                            routeResponse.exChangeInfoSet.exChangeInfo[index]?.fast_train_info || null
                        }
                    />

                    {index < routeResponse.onStationSet.station.length - 1 && (
                        <TransferInfo
                            walkTime={routeResponse.exChangeInfoSet.exChangeInfo[index]?.exWalkTime || 2}
                        />
                    )}
                </React.Fragment>
            ))}

        </Container>
    );
};

export default SubwayRoutePage;
