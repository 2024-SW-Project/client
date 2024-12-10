import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  z-index: 1010;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const StyledCalendar = styled(Calendar)`
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const CalendarModal = ({ onClose, onSave }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isHoliday, setIsHoliday] = useState(false);
    const [reminderTime, setReminderTime] = useState("07:00");

    // 로컬 시간대로 날짜를 포맷팅하는 함수
    const formatDateToLocal = (date) => {
        const offset = date.getTimezoneOffset() * 60000; // 타임존 오프셋 계산
        const localDate = new Date(date.getTime() - offset); // UTC에서 로컬 시간대로 변환
        return localDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
    };

    const handleSave = () => {
        const dayType = isHoliday ? 2 : selectedDate.getDay() === 6 ? 1 : 0;
        const formattedDate = formatDateToLocal(selectedDate); // 로컬 시간으로 포맷팅

        onSave({
            scheduled_date: formattedDate,
            day_type: dayType,
            reminder_time: reminderTime,
        });
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalBackground onClick={handleBackgroundClick}>
            <ModalContainer>
                <CloseButton onClick={onClose}>×</CloseButton>
                <Title>캘린더 설정</Title>
                <StyledCalendar onChange={setSelectedDate} value={selectedDate} />
                <CheckboxContainer>
                    <Checkbox
                        type="checkbox"
                        checked={isHoliday}
                        onChange={(e) => setIsHoliday(e.target.checked)}
                    />
                    <Label>공휴일 여부</Label>
                </CheckboxContainer>
                <InputContainer>
                    <Label>알람 시간</Label>
                    <Input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                    />
                </InputContainer>
                <Button onClick={handleSave}>저장</Button>
            </ModalContainer>
        </ModalBackground>
    );
};

export default CalendarModal;
