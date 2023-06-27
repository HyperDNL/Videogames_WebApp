import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarContainer = styled.nav`
  background-color: #131619;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const Logo = styled.h1`
  color: #ffffff;
`;

const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  display: none;
  z-index: 999;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    position: absolute;
    top: 38px;
    right: 16px;
  }

  &:focus {
    outline: none;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #131619;
    padding: 16px;
    transform: ${({ isopen }) =>
      isopen === "true" ? "translateX(0)" : "translateX(100%)"};
    transition: transform 0.3s ease-in-out;
    z-index: 998;
  }
`;

const NavItem = styled.li`
  margin-right: 16px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #3b88c3;
  font-weight: bold;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #5fa4d6;
  }

  @media (max-width: 768px) {
    color: #3b88c3;
    text-align: center;
  }
`;

const Navbar = ({ routes }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <NavbarContainer>
      <Logo>Videogames App</Logo>
      <MenuButton onClick={handleMenuClick}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </MenuButton>
      <NavMenu isopen={isMenuOpen.toString()}>
        {routes.map(({ route, name }, index) => (
          <NavItem key={index}>
            <NavLink to={route} onClick={handleNavLinkClick}>
              {name}
            </NavLink>
          </NavItem>
        ))}
      </NavMenu>
    </NavbarContainer>
  );
};

export default Navbar;
