import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { FaTrainSubway } from "react-icons/fa6";

const StationListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 0 2rem; /* 좌우 패딩 */
`;

const Line = styled.div`
    position: absolute;
    left: 4rem; /* 선이 동그라미를 통과하도록 위치 조정 */
    top: 0;
    width: 4px;
    background-color: #4d7eff;
    z-index: 0;
    height: ${({ height }) => height}px; /* 동적으로 높이 설정 */
`;

const StationContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    margin: 1rem 0;
`;

const Circle = styled.div`
    width: 12px;
    height: 12px;
    background-color: #ffffff;
    border: 2px solid #4d7eff;
    border-radius: 50%;
    position: absolute;
    left: 1.75rem;
    z-index: 1;
`;

const TrainIcon = styled(FaTrainSubway)`
    color: #4d7eff;
    font-size: 1.2rem;
    position: absolute;
    z-index: 2;
    visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
`;

const StationName = styled.div`
    font-size: 1rem;
    color: #333;
    margin-left: 3.5rem; /* 이름을 동그라미 오른쪽으로 배치 */
`;

const SubwayLiveMap = ({ stations, currentTrains }) => {
    const containerRef = useRef(null);
    const [lineHeight, setLineHeight] = useState(0);

    useEffect(() => {
        // 컨테이너 높이를 기준으로 Line의 높이를 설정
        if (containerRef.current) {
            setLineHeight(containerRef.current.scrollHeight); // 스크롤 가능한 전체 높이
        }
    }, [stations]);

    return (
        <StationListContainer ref={containerRef}>
            <Line height={lineHeight} />
            {stations.map((station, index) => (
                <StationContainer key={index}>
                    <Circle />
                    <TrainIcon isVisible={currentTrains.includes(station)} />
                    <StationName>{station}</StationName>
                </StationContainer>
            ))}
        </StationListContainer>
    );
};

export default SubwayLiveMap;
