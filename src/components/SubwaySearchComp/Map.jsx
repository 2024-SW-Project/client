import React, { useEffect, useRef } from 'react';
import Subway from '../../assets/Seoul_subway_linemap_ko.svg';
import styled from "styled-components";

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
    const initialDistance = useRef(0); // 두 손가락 간 초기 거리 저장 //--바꾼부분

    useEffect(() => {
        const objectElement = svgRef.current;

        const handleLoad = () => {
            const svgDoc = objectElement.contentDocument;
            if (!svgDoc) {
                console.error("SVG Document가 로드되지 않았습니다.");
                return;
            }

            const svgRoot = svgDoc.documentElement;
            const svgWidth = svgRoot.viewBox.baseVal.width;
            const svgHeight = svgRoot.viewBox.baseVal.height;

            const centerX = (3420 / 5724) * svgWidth;
            const centerY = (2354 / 6516) * svgHeight;

            currentViewBox.current = {
                x: centerX - 500 / 2,
                y: centerY - 450 / 2,
                width: 500,
                height: 450
            };
            updateViewBox();

            const targetElements = svgDoc.querySelectorAll('#name_ko text, #name_ko_overlap text');
            targetElements.forEach((element) => {
                element.addEventListener('click', () => {
                    const tspanElements = element.querySelectorAll('tspan');
                    if (tspanElements.length > 0) {
                        const tspanTexts = Array.from(tspanElements).map(tspan => tspan.textContent).join('');
                        console.log('tspan 값:', tspanTexts);
                    } else {
                        console.log('클릭된 text 요소의 값:', element.textContent);
                    }
                });
            });

            svgDoc.addEventListener('pointerdown', onPointerDown, { passive: false });
            svgDoc.addEventListener('pointermove', onPointerMove, { passive: false });
            svgDoc.addEventListener('pointerup', onPointerUp, { passive: false });

            svgDoc.addEventListener('touchstart', onTouchStart, { passive: false }); //--바꾼부분
            svgDoc.addEventListener('touchmove', onTouchMove, { passive: false }); //--바꾼부분
            svgDoc.addEventListener('touchend', onPointerUp, { passive: false });

            svgDoc.addEventListener('wheel', onZoom, { passive: false });
        };

        objectElement.addEventListener('load', handleLoad);

        return () => {
            objectElement.removeEventListener('load', handleLoad);
        };
    }, []);

    const getPointFromEvent = (event) => {
        const point = { x: 0, y: 0 };
        if (event.targetTouches) {
            point.x = event.targetTouches[0].clientX;
            point.y = event.targetTouches[0].clientY;
        } else {
            point.x = event.clientX;
            point.y = event.clientY;
        }
        return point;
    };

    const calculateDistance = (touches) => { //--바꾼부분
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (event) => { //--바꾼부분
        if (event.touches.length === 2) {
            initialDistance.current = calculateDistance(event.touches); // 두 손가락 사이 거리 저장
        } else {
            onPointerDown(event); // 한 손가락일 경우 일반 포인터 다운으로 처리
        }
    };

    const onTouchMove = (event) => { //--바꾼부분
        if (event.touches.length === 2) {
            event.preventDefault();
            const newDistance = calculateDistance(event.touches);
            const zoomFactor = newDistance / initialDistance.current;

            const viewBoxCenterX = currentViewBox.current.x + currentViewBox.current.width / 2;
            const viewBoxCenterY = currentViewBox.current.y + currentViewBox.current.height / 2;

            const newWidth = currentViewBox.current.width / zoomFactor;
            const newHeight = currentViewBox.current.height / zoomFactor;

            currentViewBox.current.x = viewBoxCenterX - newWidth / 2;
            currentViewBox.current.y = viewBoxCenterY - newHeight / 2;

            currentViewBox.current.width = newWidth;
            currentViewBox.current.height = newHeight;

            updateViewBox();
            initialDistance.current = newDistance;
        } else {
            onPointerMove(event); // 한 손가락일 경우 일반 포인터 이동 처리
        }
    };

    const onPointerDown = (event) => {
        isPointerDown.current = true;
        const point = getPointFromEvent(event);
        pointerOrigin.current = { x: point.x, y: point.y };
    };

    const onPointerMove = (event) => {
        if (!isPointerDown.current) return;
        event.preventDefault();

        const point = getPointFromEvent(event);
        const deltaX = point.x - pointerOrigin.current.x;
        const deltaY = point.y - pointerOrigin.current.y;

        const sensitivity = 2;
        currentViewBox.current.x -= deltaX * sensitivity;
        currentViewBox.current.y -= deltaY * sensitivity;

        updateViewBox();
        pointerOrigin.current = { x: point.x, y: point.y };
    };

    const onPointerUp = () => {
        isPointerDown.current = false;
    };

    const onZoom = (event) => {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;

        const viewBoxCenterX = currentViewBox.current.x + currentViewBox.current.width / 2;
        const viewBoxCenterY = currentViewBox.current.y + currentViewBox.current.height / 2;

        const newWidth = currentViewBox.current.width / zoomFactor;
        const newHeight = currentViewBox.current.height / zoomFactor;

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
        </StyledMapContainer>
    );
};

export default Map;
