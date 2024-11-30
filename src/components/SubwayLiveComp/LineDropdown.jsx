import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
    position: relative;
    width: 90%;
    max-width: 600px;
    margin: 1rem 0;
`;

const Label = styled.label`
    display: block;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #333;
`;

const Dropdown = styled.div`
    position: relative;
    width: 100%;
`;

const DropdownButton = styled.button`
    width: 100%;
    height: 2.5rem;
    padding: 0.8rem;
    font-size: 1rem;
    text-align: left;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        border-color: #4d7eff;
    }

    &:focus {
        border-color: #4d7eff;
        outline: none;
    }
`;

const DropdownMenu = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const DropdownItem = styled.li`
    padding: 0.8rem;
    font-size: 1rem;
    cursor: pointer;
    background-color: ${({ selected }) => (selected ? "#f0f8ff" : "#ffffff")};

    &:hover {
        background-color: #e0e0e0;
    }
`;

const LineDropdown = ({ label, options, selectedValue, onSelect }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <DropdownContainer>
            <Label>{label}</Label>
            <Dropdown>
                <DropdownButton onClick={toggleDropdown}>
                    {selectedValue || "선택"}
                    <span>▼</span>
                </DropdownButton>
                {dropdownOpen && (
                    <DropdownMenu>
                        {options.map((option) => (
                            <DropdownItem
                                key={option.code}
                                selected={option.name === selectedValue}
                                onClick={() => {
                                    onSelect(option.name);
                                    setDropdownOpen(false);
                                }}
                            >
                                {option.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                )}
            </Dropdown>
        </DropdownContainer>
    );
};

export default LineDropdown;
