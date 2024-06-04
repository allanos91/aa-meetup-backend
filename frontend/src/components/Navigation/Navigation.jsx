import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './ProfileButton.css'
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ? (
    <>
      <li className='profile-button'>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <>
      <li>
        <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal/>}
            />
      </li>
      <li>
        <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal/>}
        />
      </li>
    </>
  );

  return (

    <ul className='user-login-signup'>
      <li id="home">

        <NavLink to="/">
            <img
         className='logo'
         src="/frontend/public/football-cleat-icon.jpg"
         alt="cleat logo"
         />
         </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
