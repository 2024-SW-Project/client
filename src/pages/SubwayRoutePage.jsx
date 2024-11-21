import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa6";
import TransferInfo from '../components/SubwayRouteComp/TransferInfo';
import StationDetailInfo from '../components/SubwayRouteComp/StationDetailInfo';
import { bookmarkState, startStationState, endStationState, climateCardState, routeResponseState } from '../atoms/atom';
import { useRecoilState, useRecoilValue } from 'recoil';

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

    const [travelTime, setTravelTime] = useState(0);
    const [transferCount, setTransferCount] = useState(0);

    const calculateTravelTime = (departure, arrival) => {
        const [depHour, depMinute] = departure.split(':').map(Number);
        const [arrHour, arrMinute] = arrival.split(':').map(Number);

        const depTotalMinutes = depHour * 60 + depMinute;
        const arrTotalMinutes = arrHour * 60 + arrMinute;

        return arrTotalMinutes - depTotalMinutes;
    };

    const getLineColor = (lineNumber) => {
        const lineColors = {
            2: '#009bdc',
            "우이": '#a4c639',
            4: '#b5651d',
            // 다른 노선 색 추가 가능
        };

        return lineColors[lineNumber] || '#333';
    };

    const convertSecondsToMinutes = (seconds) => {
        return Math.round(seconds / 60);
    };

    useEffect(() => {
        console.log(hasClimateCard);
        console.log(routeResponse);

        setStartStation(routeResponse.pathInfo.start_station_name);
        setEndStation(routeResponse.pathInfo.end_station_name);
        setIsBookmark(routeResponse.pathInfo.is_favorite_route);
        setTravelTime(routeResponse.pathInfo.travel_time);
        setTransferCount(routeResponse.exChangeInfoSet.exChangeInfo.length);

        console.log(transferCount);
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
                    {isBookmark ? <BookmarkTIcon onClick={() => setIsBookmark(false)} /> : <BookmarkFIcon onClick={() => setIsBookmark(true)} />}
                    <CalendarIcon />
                </IconsContainer>
            </TopContainer>

            {/* 경로 세부 정보 */}

            {routeResponse.onStationSet.station.map((station, index) => (
                <React.Fragment key={index}>
                    {/* StationDetailInfo 컴포넌트 */}
                    <StationDetailInfo
                        startTime={station.departure_time}
                        startStation={station.start_station_name}
                        startLineNumber={station.line_name}
                        startLineColor={getLineColor(station.line_name)}
                        startDirection={
                            `${station.way_station_name}행 ${station.fast_train_info ? `| 빠른 환승 ${station.fast_train_info}` : ''
                            }`
                        }
                        stationsPathList={station.station_name_list}
                        stationsPathTime={calculateTravelTime(station.departure_time, station.arrival_time)}
                        endTime={station.arrival_time}
                        endStation={station.way_station_name}
                        endDoorInfo="내리는문 정보 추가" // 임의 값
                    />

                    {/* TransferInfo 컴포넌트: 마지막 역은 제외 */}
                    {index < routeResponse.onStationSet.station.length - 1 && (
                        <TransferInfo
                            walkTime={convertSecondsToMinutes(
                                routeResponse.exChangeInfoSet.exChangeInfo[index]?.exWalkTime || 0
                            )}
                        />
                    )}
                </React.Fragment>
            ))
            }

        </Container>
    );
};

export default SubwayRoutePage;
