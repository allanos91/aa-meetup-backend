// frontend/src/components/Navigation/ProfileButton.jsx
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import { Link, useNavigate } from 'react-router-dom'
import { useEventHeader } from '../../context/EventHeader';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef();
  const {setIsGrayE, setIsGrayG} = useEventHeader()
  const navigate = useNavigate()

    const onClickG = () => {
        setIsGrayE('gray')
        setIsGrayG('')
        return
    }
    const onClickE = () => {
      setIsGrayG('gray')
      setIsGrayE('')
    }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden")

  useEffect(() => {
    if (!showMenu) return

    const closeMenu = (e) => {
        if (ulRef.current && !ulRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    navigate('/')
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu)
  }

  return (
    <div className='signup-format'>
      <div className='link-button-container'>
      <Link to='/groups/createGroup' className='top-link'>Start a new group</Link>
      <button onClick={toggleMenu} className='circle-container'>
        <FaUserCircle className='circle-profile-button'/>
      </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        <li>{`Hello, ${user.firstName}`}</li>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
        <li>
        <Link to={'/groups'} onClick={onClickG}>View groups</Link>
        </li>
        <li>
        <Link to={'/groups'} onClick={onClickE}>View events</Link>
        </li>
      </ul>
    </div>
  );
}

export default ProfileButton;
