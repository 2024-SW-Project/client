import React from 'react';
import styled from 'styled-components';
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa6";
import TransferInfo from '../components/SubwayRouteComp/TransferInfo';
import StationDetailInfo from '../components/SubwayRouteComp/StationDetailInfo';
import { bookmarkState } from '../atoms/atom';
import { useRecoilState } from 'recoil';

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
    const transferCount = 2;

    return (
        <Container>
            {/* 소요시간 정보 */}
            <TopContainer>
                <TimeContainer>
                    <TimeText>32분</TimeText>
                    <TransferText>환승 {transferCount}회</TransferText>
                </TimeContainer>
                {/* 즐겨찾기, 캘린더 아이콘 */}
                <IconsContainer>
                    {isBookmark ? <BookmarkTIcon onClick={() => setIsBookmark(false)} /> : <BookmarkFIcon onClick={() => setIsBookmark(true)} />}
                    <CalendarIcon />
                </IconsContainer>
            </TopContainer>

            {/* 경로 세부 정보 */}

            {/* 고려대-보문 구간 */}
            <StationDetailInfo
                startTime="01:14"
                startStation="고려대"
                startLineNumber="6"
                startLineColor="#b5651d"
                startDirection="응암행 | 빠른 환승 3-4"
                stationsPathList={["안암"]}
                stationsPathTime={2}
                endTime="01:17"
                endStation="보문"
                endDoorInfo="내리는문 왼쪽"
            />

            <TransferInfo walkTime={3} />

            {/* 보문-성신여대입구 구간 */}
            <StationDetailInfo
                startTime="01:22"
                startStation="보문"
                startLineNumber="우이"
                startLineColor="#a4c639"
                startDirection="북한산우이행 | 빠른 환승 1-2"
                stationsPathList={[]}
                stationsPathTime={1}
                endTime="01:23"
                endStation="성신여대입구"
                endDoorInfo="내리는문 오른쪽"
            />

            <TransferInfo walkTime={4} />

            {/* 성신여대입구-수유 구간 */}
            <StationDetailInfo
                startTime="01:29"
                startStation="성신여대입구"
                startLineNumber="4"
                startLineColor="#009bdc"
                startDirection="불암산행 | 빠른 하차 3-1, 8-2"
                stationsPathList={["길음", "미아사거리", "미아"]}
                stationsPathTime={9}
                endTime="01:36"
                endStation="수유"
                endDoorInfo="내리는문 오른쪽"
            />

        </Container>
    );
};

export default SubwayRoutePage;
