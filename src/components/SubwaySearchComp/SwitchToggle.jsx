import { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    margin: 0.5rem;
    min-width: 150px;
`;

// 토글 버튼 외곽 박스
const ToggleWrapper = styled.div`
    width: 50px;
    height: 24px;
    border-radius: 30px;
    background-color: #c0c0c0;
    position: relative;
    transition: background-color 0.5s;

    &.toggle--checked {
        background-color: #4A6CF7;
    }
`;

// 토글 버튼 내부 원
const ToggleCircle = styled.div`
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: #FFFFFF;
    transition: left 0.5s;

    &.toggle--checked {
        left: 27px;
    }
`;

// 텍스트를 포함하는 컨테이너
const TextContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 100px;
`;

// 텍스트 스타일
const Text = styled.div`
    position: absolute;
    transition: opacity 0.5s ease;
    color: #333;
    font-size: 14px;
    text-shadow: -1.5px 0px #FFFFFF, 0px 1.5px #FFFFFF, 1.5px 0px #FFFFFF, 0px -1.5px #FFFFFF;
    white-space: nowrap;
    opacity: ${(props) => (props.$visible ? 1 : 0)};
`;

export const SwitchToggle = () => {
    const [isOn, setIsOn] = useState(false);

    const toggleHandler = () => {
        setIsOn(!isOn);
    };

    return (
        <ToggleContainer onClick={toggleHandler}>
            {/* 토글 버튼 */}
            <ToggleWrapper className={isOn ? "toggle--checked" : ""}>
                <ToggleCircle className={isOn ? "toggle--checked" : ""} />
            </ToggleWrapper>
            {/* 토글 글씨 */}
            <TextContainer>
                <Text $visible={!isOn}>일반 경로추천</Text>
                <Text $visible={isOn}>기후동행카드 경로추천</Text>
            </TextContainer>
        </ToggleContainer>
    );
};
