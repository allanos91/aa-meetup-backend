import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './ProfileButton.css'
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import logo from '../../../public/football-cleat-icon.jpg'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ? (
    <>
      <li className='profile-button'>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <div className='user-buttons'>
        <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal/>}
            />

        <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal/>}
        />

    </div>
  );

  return (

    <ul className='user-login-signup'>
      <div id="home">
        <h1 id='page-name'>Cleet Up!</h1>
        <NavLink to="/">
            <img
            className='logo'
         src={logo}
         alt="cleat logo"
         />
         </NavLink>
      </div>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
