import React from 'react';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { sidebarState, loginState } from '../atoms/atom';
import { Link } from 'react-router-dom';
import { FaLocationDot, FaTrainSubway } from "react-icons/fa6";

const SidebarContainer = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    width: 250px;
    height: 100%;
    background-color: #FFFFFF;
    z-index: 1001;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.1);
`;

// 사이드바 외부를 클릭하면 닫히는 오버레이
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
`;

// 로그인연결박스 또는 프로필 클릭 버튼
const LoginPrompt = styled(Link)`
    width: fit-content;
    font-size: 1rem;
    color: #666271;
    opacity: 0.8;
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover {
        color: #666271;
        opacity: 1;
    }
`;

// 사용자 프로필 이미지 스타일
const ProfileImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 0.5rem;
`;

// 메뉴 그룹 컨테이너
const MenuGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

// 개별 메뉴 항목
const MenuItem = styled(Link)`
    width: fit-content;
    font-size: 1rem;
    color: #181820;
    text-decoration: none;
    display: flex;
    align-items: center;

    &:hover {
        color: #4D7EFF;
    }
`;

// 로그인/로그아웃 글자 버튼
const LoginText = styled.div`
    font-size: 12px;
    color: #c0c0c0;
    text-align: center;
    cursor: pointer;
    align-self: center;

    &:hover {
        color: #666271;
    }
`;

// 푸터 로고 이미지
const FooterLogo = styled.img`
    width: 100px;
    height: auto;
    align-self: center;
    margin-top: auto;
`;

const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: #C0C0C0;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
`;

// 경로조회메뉴 아이콘
const SubwaySearchIcon = styled(FaLocationDot)`
    color: #4D7EFF;
    margin-right: 0.5rem;
`;

// 실시간 위치메뉴 아이콘
const SubwayLiveIcon = styled(FaTrainSubway)`
    color: #4D7EFF;
    margin-right: 0.5rem;
`;

const SideBar = () => {
    const setSidebarOpen = useSetRecoilState(sidebarState);
    const [isLogin, setLoginState] = useRecoilState(loginState);

    return (
        <>
            {/* 오버레이: 사이드바 외부 클릭 시 닫기 */}
            <Overlay onClick={() => setSidebarOpen(false)} />

            {/* 로그인 여부에 따른 사이드바 내용 */}
            {isLogin ? (
                <SidebarContainer>
                    {/* 로그인 상태: 프로필 사진과 이름 */}
                    <LoginPrompt to="/mypage" onClick={() => setSidebarOpen(false)}>
                        <ProfileImage src="/karina.png" alt="Profile" />
                        카리나
                    </LoginPrompt>

                    <Divider />
                    {/* 메뉴 그룹 */}
                    <MenuGroup>
                        <MenuItem to="/subway/search" onClick={() => setSidebarOpen(false)}>
                            <SubwaySearchIcon />경로조회
                        </MenuItem>
                        <MenuItem to="/subway/live" onClick={() => setSidebarOpen(false)}>
                            <SubwayLiveIcon />실시간위치
                        </MenuItem>
                    </MenuGroup>

                    <Divider />

                    {/* 로그아웃 버튼 */}
                    <LoginText to="/subway/search" onClick={() => { setLoginState(false); setSidebarOpen(false); }}>
                        로그아웃
                    </LoginText>

                    <FooterLogo src="/logo2.png" alt="logo" />
                </SidebarContainer>
            ) : (
                <SidebarContainer>
                    {/* 비로그인 상태: 로그인 링크 */}
                    <LoginPrompt to="/auth/login" onClick={() => setSidebarOpen(false)}>
                        로그인을 해주세요
                    </LoginPrompt>

                    <Divider />

                    {/* 메뉴 그룹 */}
                    <MenuGroup>
                        <MenuItem to="/subway/search" onClick={() => setSidebarOpen(false)}>
                            <SubwaySearchIcon />경로조회
                        </MenuItem>
                        <MenuItem to="/subway/live" onClick={() => setSidebarOpen(false)}>
                            <SubwayLiveIcon />실시간위치
                        </MenuItem>
                    </MenuGroup>

                    <Divider />

                    {/* 로그인 버튼 */}
                    <LoginText onClick={() => { setLoginState(true); setSidebarOpen(false); }}>
                        로그인
                    </LoginText>

                    <FooterLogo src="/logo2.png" alt="logo" />
                </SidebarContainer>
            )}
        </>
    );
};

export default SideBar;