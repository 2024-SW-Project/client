import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa6";
import { apiCall } from '../utils/Api';
import { useRecoilState } from "recoil";
import { userInfoState } from "../atoms/atom";

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

const ProfileWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FieldContainer = styled.div`
    width: 100%;
    margin-bottom: 1.5rem;
`;

const FieldLabel = styled.label`
    font-size: 0.9rem;
    color: #666271;
    display: block;
    margin-bottom: 0.5rem;
`;

const ReadOnlyText = styled.div`
    font-size: 1rem;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    outline: none;
    font-size: 1rem;

    &:focus {
        border-bottom: 2px solid #4d7eff;
    }

    &::placeholder {
        color: #c0c0c0;
    }
`;

const WarningText = styled.div`
    color: red;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;

const SuccessText = styled.div`
    color: green;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;

const EditButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #666271;
    font-size: 1rem;
    display: flex;
    align-items: center;
`;

const SaveButton = styled.button`
    background: aliceblue;
    margin: 0.5rem 0;
    height: 2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    color: #4d7eff;
    font-size: 0.9rem;
    width: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CheckButton = styled.button`
    margin-top: 0.5rem;
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
    color: #333;
    border: none;
    border-radius: 5px;
    background-color: #f1f1f1;
    cursor: pointer;

    &:hover {
        background-color: #e1e1e1;
    }

    &:focus {
        background-color: #f1f1f1;
    }
`;


const ClimateCardStatus = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
`;

const ClimateCardOption = styled.div`
    flex: 1;
    padding: 0.5rem;
    text-align: center;
    border-radius: 25px;
    font-weight: bold;
    background-color: ${({ selected }) =>
        selected ? "#4d7eff" : "transparent"};
    color: ${({ selected }) => (selected ? "#fff" : "#4d7eff")};
    border: 2px solid #4d7eff;
    cursor: pointer;
`;


const PasswordChangeButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #666271;
    font-size: 1rem;
`;

// 비번변경/최원탈퇴 텍스트를 담는 컨테이너
const PwChangeWithdrawContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
`;

const InputContainer = styled.div`
    width: 100%;
    margin-top: 1.5rem;
    padding: 2rem;
    background-color: #eaeefd5f;
    border-radius: 1rem;
`;

const Label = styled.label`
    font-size: 0.9rem;
    color: #666271;
    display: block;
    margin-bottom: 0.5rem;
`;

const WithdrawInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: none;
    border: 1px solid #c0c0c0;
    outline: none;
    font-size: 1rem;

    &:focus {
        border: 2px solid #4d7eff;
    }

    &::placeholder {
        color: #c0c0c0;
    }
`;

const MyPage = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        nickname: "",
        email: "",
        isClimateCardEligible: null,
    });
    const [editingField, setEditingField] = useState(null);
    const [checkStatus, setCheckStatus] = useState({
        nickname: "",
        email: "",
    });
    const [warnings, setWarnings] = useState({});
    const [withdrawPw, setWithdrawPw] = useState("");
    const [withdrawField, setWithdrawField] = useState(false);
    const [withdrawWarning, setWithdrawWarning] = useState("경고");
    const navigate = useNavigate();

    const [userInfoRecoil, setUserInfoRecoil] = useRecoilState(userInfoState);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/mypage/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setUserInfo(response.data);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    const validateField = (field, value) => {
        let warning = "";
        if (field === "name" && !value.trim()) {
            warning = "이름을 작성해주세요.";
        } else if (field === "nickname" && !value.trim()) {
            warning = "닉네임을 작성해주세요.";
        } else if (field === "email" && !value.trim()) {
            warning = "이메일을 작성해주세요.";
        } else if (field === "email" && !value.includes("@")) {
            warning = "올바른 이메일을 입력해주세요.";
        } else if (field === "isClimateCardEligible" && value === null) {
            warning = "기후동행카드 소지 여부를 선택해주세요.";
        }
        setWarnings((prev) => ({ ...prev, [field]: warning }));
        return !warning;
    };

    const handleCheckNickname = async () => {
        if (!validateField("nickname", userInfo.nickname)) return;
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/auth/signup/check-nickname`,
                { params: { nickname: userInfo.nickname } }
            );
            if (response.data.isAvailable) {
                setCheckStatus((prev) => ({ ...prev, nickname: "success" }));
                setWarnings((prev) => ({ ...prev, nickname: "" }));
            }
        } catch (error) {
            setCheckStatus((prev) => ({ ...prev, nickname: "error" }));
        }
    };

    const handleCheckEmail = async () => {
        if (!validateField("email", userInfo.email)) return;
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/auth/signup/check-email`,
                { params: { email: userInfo.email } }
            );
            if (response.data.isAvailable) {
                setCheckStatus((prev) => ({ ...prev, email: "success" }));
                setWarnings((prev) => ({ ...prev, email: "" }));
            }
        } catch (error) {
            setCheckStatus((prev) => ({ ...prev, email: "error" }));
        }
    };

    const handleSave = async (field) => {
        if (!validateField(field, userInfo[field])) return;
        if ((field === "nickname" && checkStatus.nickname !== "success") ||
            (field === "email" && checkStatus.email !== "success")) {
            alert("중복체크를 완료해주세요.");
            return;
        }

        try {
            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/mypage/profile`,
                { [field]: userInfo[field] },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setEditingField(null);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleClimateCardSelection = (value) => {
        setUserInfo((prev) => ({
            ...prev,
            isClimateCardEligible: value,
        }));
    };

    const handleFieldChange = (field, value) => {
        setUserInfo((prev) => ({ ...prev, [field]: value }));
        setCheckStatus((prev) => ({ ...prev, [field]: "" }));
    };

    const handleEditClick = (field) => {
        if (editingField && editingField !== field) {
            alert("현재 필드의 수정을 완료해주세요!");
            return;
        }
        setEditingField(field);
    };

    const handlePasswordChangeClick = () => {
        if (editingField) {
            alert("수정을 완료해주세요!");
        } else {
            navigate("/mypage/change-password");
        }
    };

    const handleWithdrawalField = () => {
        const confirmed = window.confirm("정말 회원을 탈퇴하실건가요?");
        if (confirmed) {
            setWithdrawField(true);
        } else {
            setWithdrawField(false);
            console.log("회원 탈퇴 취소");
        }
    };

    const handleWithdrawal = async (password, navigate, setUserInfoRecoil) => {
        const confirmed = window.confirm("정말 진짜 회원을 탈퇴하실건가요?");
        if (confirmed) {
            try {
                const response = await apiCall(
                    "delete",
                    `${import.meta.env.VITE_SERVER_URL}/mypage/delete`,
                    { password },
                    setUserInfoRecoil
                );

                if (response.data.message === "Account and related data deleted successfully") {
                    alert("회원 탈퇴가 완료되었습니다.");

                    // 로컬 스토리지 및 Axios 헤더 초기화
                    localStorage.removeItem("accessToken");
                    axios.defaults.headers.common["Authorization"] = "";

                    // Recoil 상태 초기화
                    setUserInfoRecoil((prev) => ({
                        ...prev,
                        isLogIn: false,
                        nickname: "",
                        profile_picture: "",
                        user_id: null,
                    }));

                    // 로그인 페이지로 리다이렉트
                    navigate("/auth/login");
                } else {
                    setWithdrawWarning("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                console.error("회원 탈퇴 요청 실패:", error);
                setWithdrawWarning("회원 탈퇴 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
        } else {
            setWithdrawPw("");
            setWithdrawField(false);
            console.log("회원 탈퇴 취소");
        }

    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
        <Container>
            <ProfileWrapper>
                {/* 이름 */}
                <FieldContainer>
                    <FieldLabel>이름</FieldLabel>
                    {editingField === "name" ? (
                        <>
                            <Input
                                value={userInfo.name}
                                onChange={(e) =>
                                    handleFieldChange("name", e.target.value)
                                }
                            />
                            {warnings.name && <WarningText>{warnings.name}</WarningText>}
                            <SaveButton onClick={() => handleSave("name")}>저장</SaveButton>
                        </>
                    ) : (
                        <ReadOnlyText>
                            {userInfo.name || "이름 없음"}
                            <EditButton onClick={() => handleEditClick("name")}>
                                <FaPen />
                            </EditButton>
                        </ReadOnlyText>
                    )}
                </FieldContainer>
                {/* 닉네임 */}
                <FieldContainer>
                    <FieldLabel>닉네임</FieldLabel>
                    {editingField === "nickname" ? (
                        <>
                            <Input
                                value={userInfo.nickname}
                                onChange={(e) =>
                                    handleFieldChange("nickname", e.target.value)
                                }
                            />
                            <CheckButton onClick={handleCheckNickname}>중복체크</CheckButton>
                            {warnings.nickname && <WarningText>{warnings.nickname}</WarningText>}
                            {checkStatus.nickname === "success" && (
                                <SuccessText>사용 가능한 닉네임입니다.</SuccessText>
                            )}
                            {checkStatus.nickname === "error" && (
                                <WarningText>사용 불가능한 닉네임입니다.</WarningText>
                            )}
                            <SaveButton onClick={() => handleSave("nickname")}>
                                저장
                            </SaveButton>
                        </>
                    ) : (
                        <ReadOnlyText>
                            {userInfo.nickname || "닉네임 없음"}
                            <EditButton onClick={() => handleEditClick("nickname")}>
                                <FaPen />
                            </EditButton>
                        </ReadOnlyText>
                    )}
                </FieldContainer>
                {/* 이메일 */}
                <FieldContainer>
                    <FieldLabel>이메일</FieldLabel>
                    {editingField === "email" ? (
                        <>
                            <Input
                                value={userInfo.email}
                                onChange={(e) =>
                                    handleFieldChange("email", e.target.value)
                                }
                            />
                            <CheckButton onClick={handleCheckEmail}>중복체크</CheckButton>
                            {warnings.email && <WarningText>{warnings.email}</WarningText>}
                            {checkStatus.email === "success" && (
                                <SuccessText>사용 가능한 이메일입니다.</SuccessText>
                            )}
                            {checkStatus.email === "error" && (
                                <WarningText>사용 불가능한 이메일입니다.</WarningText>
                            )}
                            <SaveButton onClick={() => handleSave("email")}>저장</SaveButton>
                        </>
                    ) : (
                        <ReadOnlyText>
                            {userInfo.email || "이메일 없음"}
                            <EditButton onClick={() => handleEditClick("email")}>
                                <FaPen />
                            </EditButton>
                        </ReadOnlyText>
                    )}
                </FieldContainer>
                <FieldContainer>
                    <FieldLabel>기후동행카드 소지 여부</FieldLabel>
                    {editingField === "isClimateCardEligible" ? (
                        <>
                            <ClimateCardStatus>
                                <ClimateCardOption
                                    selected={userInfo.isClimateCardEligible === true}
                                    onClick={() => handleClimateCardSelection(true)}
                                >
                                    O
                                </ClimateCardOption>
                                <ClimateCardOption
                                    selected={userInfo.isClimateCardEligible === false}
                                    onClick={() => handleClimateCardSelection(false)}
                                >
                                    X
                                </ClimateCardOption>
                            </ClimateCardStatus>
                            {warnings.isClimateCardEligible && (
                                <WarningText>{warnings.isClimateCardEligible}</WarningText>
                            )}
                            <SaveButton onClick={() => handleSave("isClimateCardEligible")}>
                                저장
                            </SaveButton>
                        </>
                    ) : (
                        <ClimateCardStatus>
                            <ClimateCardOption selected={userInfo.isClimateCardEligible}>
                                O
                            </ClimateCardOption>
                            <ClimateCardOption selected={!userInfo.isClimateCardEligible}>
                                X
                            </ClimateCardOption>
                            <EditButton onClick={() => handleEditClick("isClimateCardEligible")}>
                                <FaPen />
                            </EditButton>
                        </ClimateCardStatus>
                    )}
                </FieldContainer>

                <PwChangeWithdrawContainer>
                    <PasswordChangeButton onClick={handlePasswordChangeClick}>
                        비밀번호변경
                    </PasswordChangeButton>
                    <PasswordChangeButton onClick={handleWithdrawalField}>
                        회원탈퇴
                    </PasswordChangeButton>
                </PwChangeWithdrawContainer>
                {withdrawField ? (
                    <InputContainer>
                        <Label>비밀번호</Label>
                        <WithdrawInput
                            type="password"
                            placeholder="입력해주세요"
                            value={withdrawPw}
                            onChange={(e) => setWithdrawPw(e.target.value)}
                        />
                        <WarningText>{withdrawWarning}</WarningText>
                        <SaveButton onClick={() => handleWithdrawal(withdrawPw, navigate, setUserInfoRecoil)}>
                            탈퇴
                        </SaveButton>
                    </InputContainer>
                ) : (<></>)}
            </ProfileWrapper>
        </Container>
    );
};

export default MyPage;