//Global styling to be applied to entire app

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *::after,
  *::before {
    max-width: 1200px;
    margin: auto;
  }

  Navbar {
    background: ${({ theme }) => theme.body};  
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  
  form {
    
  }
  `;

  export default GlobalStyles;