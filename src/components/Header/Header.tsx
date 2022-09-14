import { HeaderContainer } from "./styles";
import igniteLogo from "../../../public/assets/igniteLogo.svg";
import { Timer, Scroll } from "phosphor-react";
import { NavLink } from "react-router-dom";
export function Header() {
  return (
    <HeaderContainer>
      <NavLink to="/">
          <img
            src={igniteLogo}
            alt="Setas verdes inclinadas para o canto superior esquerdo"
            title="Ignite Logo"
          />
      </NavLink>
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24}/>
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24}/>
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
