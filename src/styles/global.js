//Global styling to be applied to entire app

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *::before {
    max-width: 1200px;
    margin: auto;
  }
  
  body {
    background-image: url(${({theme}) => theme.bg});
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
    background-attachment: fixed;
    background-size: cover,
    background-repeat: no-repeat,
    background-position: center center;
  }

  .navbar {
    background-color: ${({ theme }) => theme.body};
    transition: all 0.25s linear;
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.25);
  }
  
  .navbar a {
    font-weight: bold;
    text-decoration: none;
    color:  ${({ theme }) => theme.text};
    text-shadow: 1px;
  }

  .navbar a:hover {
    color: royalblue;
  }

  .logout {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }

  .logout:hover {
    color: red;
  }

  .navbar li {
    font-weight: bold;
  }

  .dropdown-menu {
    background-color: ${({ theme }) => theme.dropdown};
  }

  table {
    box-shadow: 2px 2px 8px 4px rgba(0,0,0,0.25);
  }

  th {
    color: ${({ theme }) => theme.text};
  }

  td {
    color: ${({ theme }) => theme.text};
  }

  h4{
    text-align: center;
    margin: 20px;
    font-size: 40px;
  }

  .custom-switch label {
    float: right;
    margin-top: 8px;
    font-weight: bold;
  }

  .authors {
    text-align: center;
    margin: 40px;
  }

  .search-btn{
    background-color: #008CBA;
    border-radius: 4px;
    margin: 4px;
    border: none;
    color: white;
    text-decoration: none;
    display: inline-block;
    padding: 4px;
  }

  .container{
    background-color: ${({ theme }) => theme.body};
  }

  #featureBadge{
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.body}
  }

  .card-body {
    background-color:${({ theme }) => theme.gameDetail} 
  }

  .comment-theme{
    color: ${({ theme }) => theme.text};
    background-color:${({ theme }) => theme.body} 

  }

  .
  `;

  export default GlobalStyles;