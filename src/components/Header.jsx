import React from 'react';
import styled from "styled-components";
import { FaBars } from "react-icons/fa6";
import { useSetRecoilState } from 'recoil';
import { sidebarState, startStationState, endStationState } from '../atoms/atom';
import { useNavigate, useLocation } from 'react-router-dom';

const Container = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #FFFFFF;
    padding: 0 1rem;
    z-index: 1000;
`;

// 왼쪽 섹션에 로고와 메뉴텍스트를 정렬
const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

// 로고 이미지
const LogoImg = styled.img`
    width: 56px;
    height: 56px;
`;

// 로고와 메뉴텍스트 사이의 구분선
const Divider = styled.div`
    width: 1.5px;
    height: 20px;
    background-color: #C0C0C0;
    margin: 0 1.25rem;
`;

// 헤더의 메뉴텍스트
const MenuText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #666271;
`;

// 오른쪽 메뉴 버튼
const MenuButton = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    font-size: 20px;
    color: #666271;
    cursor: pointer;
    outline: none;

    &:focus,
    &:active {
        outline: none;
        box-shadow: none;
    }
`;

const Header = () => {
    const setSidebar = useSetRecoilState(sidebarState);
    const setStartStation = useSetRecoilState(startStationState);
    const setEndStation = useSetRecoilState(endStationState);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoClick = () => {
        // 상태 초기화
        setStartStation("");
        setEndStation("");
        // 페이지 이동
        navigate("/subway/search");
    };

    // 현재 경로에 따른 메뉴 텍스트

    const getMenuText = (pathname) => {
        switch (pathname) {
            case '/auth/login':
                return '로그인';
            case '/auth/signup':
                return '회원가입';
            case '/auth/find-id':
                return '아이디찾기';
            case '/auth/reset-password':
                return '비밀번호 재설정';
            case '/mypage':
                return '마이페이지';
            case '/subway/search':
                return '경로조회';
            case '/subway/live':
                return '지하철 실시간위치';
            case '/subway/route':
                return '상세경로조회';
            case '/subway/save':
                return '즐겨찾기/캘린더';
            default:
                return '';
        }
    };

    return (
        <Container>
            {/* 로고 이미지와 메뉴 텍스트 */}
            <LeftSection>
                <LogoImg src="/logo1.png" alt="logo" onClick={handleLogoClick} />
                <Divider />
                <MenuText>{getMenuText(location.pathname)}</MenuText>
            </LeftSection>
            {/* 오른쪽 메뉴 버튼 */}
            <MenuButton onClick={() => setSidebar(true)}>
                <FaBars />
            </MenuButton>
        </Container>
    );
};

export default Header;
