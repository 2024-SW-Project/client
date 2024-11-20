import React, { useEffect, useRef, useState } from 'react';
import Subway from '../../assets/Seoul_subway_linemap_ko.svg';
import styled from 'styled-components';
import { startStationState, endStationState } from '../../atoms/atom';
import { useRecoilState } from 'recoil';
import LocationPicker from './LocationPicker';

const StyledMapContainer = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid #EFEFEF;
`;

const StyledObject = styled.object`
    width: 100%;
    height: 100%;
`;

const Map = () => {
    const svgRef = useRef(null); // SVG 객체 참조
    const currentViewBox = useRef({ x: 0, y: 0, width: 1200, height: 1080 }); // 초기 뷰박스 설정
    const isPointerDown = useRef(false); // 포인터 다운 상태 추적
    const pointerOrigin = useRef({ x: 0, y: 0 }); // 포인터 시작 위치 저장
    const initialDistance = useRef(0); // 두 손가락 간 초기 거리 저장
    const minWidth = 500; // 최소 너비 (최대 축소 한계)
    const minHeight = 450; // 최소 높이 (최대 축소 한계)
    const maxWidth = 2400; // 최대 너비 (최대 확대 한계)
    const maxHeight = 2160; // 최대 높이 (최대 확대 한계)

    const [startStation, setStartStation] = useRecoilState(startStationState);
    const [endStation, setEndStation] = useRecoilState(endStationState);
    const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0, stationName: '', visible: false });

    useEffect(() => {
        const objectElement = svgRef.current;

        const handleLoad = () => {
            const svgDoc = objectElement.contentDocument;
            if (!svgDoc) {
                console.error("SVG Document가 로드되지 않았습니다.");
                return;
            }

            // SVG 초기 설정
            const svgRoot = svgDoc.documentElement;
            const svgWidth = svgRoot.viewBox.baseVal.width;
            const svgHeight = svgRoot.viewBox.baseVal.height;
            const centerX = (3420 / 5724) * svgWidth;
            const centerY = (2354 / 6516) * svgHeight;

            currentViewBox.current = {
                x: centerX - 500 / 2,
                y: centerY - 450 / 2,
                width: 500,
                height: 450,
            };
            updateViewBox();

            // 텍스트 요소에 클릭 이벤트 추가
            const targetElements = svgDoc.querySelectorAll('#name_ko text, #name_ko_overlap text');
            targetElements.forEach((element) => {
                element.addEventListener('click', (event) => {
                    const rect = element.getBoundingClientRect(); // 클릭된 텍스트의 위치 가져오기
                    const stationName = element.querySelectorAll('tspan').length > 0
                        ? Array.from(element.querySelectorAll('tspan')).map(tspan => tspan.textContent).join('')
                        : element.textContent.trim();

                    // 화면 좌표 기준으로 LocationPicker 위치 설정
                    setPickerPosition({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height - 20,
                        stationName,
                        visible: true,
                    });
                });
            });

            // 이벤트 리스너 추가
            svgDoc.addEventListener('pointerdown', onPointerDown, { passive: false });
            svgDoc.addEventListener('pointermove', onPointerMove, { passive: false });
            svgDoc.addEventListener('pointerup', onPointerUp, { passive: false });
            svgDoc.addEventListener('touchstart', onTouchStart, { passive: false });
            svgDoc.addEventListener('touchmove', onTouchMove, { passive: false });
            svgDoc.addEventListener('touchend', onPointerUp, { passive: false });
            svgDoc.addEventListener('wheel', onZoom, { passive: false });
        };

        objectElement.addEventListener('load', handleLoad);

        return () => {
            objectElement.removeEventListener('load', handleLoad);
        };
    }, []);

    // 이벤트 핸들러들
    const getPointFromEvent = (event) => {
        if (event.targetTouches) {
            return { x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY };
        }
        return { x: event.clientX, y: event.clientY };
    };

    const calculateDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (event) => {
        if (event.touches.length === 2) {
            initialDistance.current = calculateDistance(event.touches);
        } else {
            onPointerDown(event);
        }
    };

    const onTouchMove = (event) => {
        if (event.touches.length === 2) {
            event.preventDefault();
            const newDistance = calculateDistance(event.touches);
            const zoomFactor = newDistance / initialDistance.current;
            const viewBoxCenterX = currentViewBox.current.x + currentViewBox.current.width / 2;
            const viewBoxCenterY = currentViewBox.current.y + currentViewBox.current.height / 2;

            let newWidth = currentViewBox.current.width / zoomFactor;
            let newHeight = currentViewBox.current.height / zoomFactor;

            if (newWidth < minWidth) newWidth = minWidth;
            if (newHeight < minHeight) newHeight = minHeight;
            if (newWidth > maxWidth) newWidth = maxWidth;
            if (newHeight > maxHeight) newHeight = maxHeight;

            currentViewBox.current.x = viewBoxCenterX - newWidth / 2;
            currentViewBox.current.y = viewBoxCenterY - newHeight / 2;
            currentViewBox.current.width = newWidth;
            currentViewBox.current.height = newHeight;

            updateViewBox();
            initialDistance.current = newDistance;
        } else {
            onPointerMove(event);
        }
    };

    const onPointerDown = (event) => {
        isPointerDown.current = true;
        pointerOrigin.current = getPointFromEvent(event);
    };

    const onPointerMove = (event) => {
        if (!isPointerDown.current) return;
        event.preventDefault();

        const point = getPointFromEvent(event);
        const deltaX = point.x - pointerOrigin.current.x;
        const deltaY = point.y - pointerOrigin.current.y;

        currentViewBox.current.x -= deltaX * 2;
        currentViewBox.current.y -= deltaY * 2;

        updateViewBox();
        pointerOrigin.current = point;
    };

    const onPointerUp = () => {
        isPointerDown.current = false;
    };

    const onZoom = (event) => {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;

        const viewBoxCenterX = currentViewBox.current.x + currentViewBox.current.width / 2;
        const viewBoxCenterY = currentViewBox.current.y + currentViewBox.current.height / 2;

        let newWidth = currentViewBox.current.width / zoomFactor;
        let newHeight = currentViewBox.current.height / zoomFactor;

        if (newWidth < minWidth) newWidth = minWidth;
        if (newHeight < minHeight) newHeight = minHeight;
        if (newWidth > maxWidth) newWidth = maxWidth;
        if (newHeight > maxHeight) newHeight = maxHeight;

        currentViewBox.current.x = viewBoxCenterX - newWidth / 2;
        currentViewBox.current.y = viewBoxCenterY - newHeight / 2;
        currentViewBox.current.width = newWidth;
        currentViewBox.current.height = newHeight;

        updateViewBox();
    };

    const updateViewBox = () => {
        const viewBoxString = `${currentViewBox.current.x} ${currentViewBox.current.y} ${currentViewBox.current.width} ${currentViewBox.current.height}`;
        svgRef.current.contentDocument.documentElement.setAttribute('viewBox', viewBoxString);
    };

    return (
        <StyledMapContainer>
            <StyledObject
                ref={svgRef}
                type="image/svg+xml"
                data={Subway}
            />
            {pickerPosition.visible && (
                <LocationPicker
                    x={pickerPosition.x}
                    y={pickerPosition.y}
                    onStartClick={() => {
                        setStartStation(pickerPosition.stationName);
                        setPickerPosition({ ...pickerPosition, visible: false });
                    }}
                    onEndClick={() => {
                        setEndStation(pickerPosition.stationName);
                        setPickerPosition({ ...pickerPosition, visible: false });
                    }}
                />
            )}
        </StyledMapContainer>
    );
};

export default Map;
