import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { useEventHeader } from '../../context/EventHeader';
import './LandingPage.css'

const LandingPage = () => {
    const isLoggedIn = useSelector(state => state.session.user)
    const {setIsGrayE, setIsGrayG} = useEventHeader()

    const onClick = () => {
        setIsGrayE('gray')
        setIsGrayG('')
        return
    }
    const onClickE = () => {
        setIsGrayE('')
        setIsGrayG('gray')
        return
    }


    const ColumnThree = () => {
        if (!isLoggedIn) {
            return (
            <div className='column-three column'>
                <img className="icon" src='https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/1606224/team-huddle-clipart-md.png'/>
                <p  className='disabled-link' >Start a new group</p>
                <p>Can&apos;t find what you are looking for? Organize your own group here</p>
            </div>
            )
        } else {
            return (
            <div className='column-three column'>
                <img className="icon" src='https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/1606224/team-huddle-clipart-md.png'/>
                <Link to='/groups/createGroup' className='link'>Start a new group</Link>
                <p>Can&apos;t find what you are looking for? Organize your own group here</p>
            </div>
            )
        }
    }


    return (
        <span>
        <section className='section-one'>
            <div className='left-box-title'>
            <h1>THE SPORTS PLATFORM- WHERE PLAYERS AND ATHLETES MEET</h1>
            <p id='section-one-desc'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste aperiam eveniet dolore nobis molestias cupiditate, culpa voluptate a, magni aliquid quidem. Beatae autem nesciunt fuga facilis neque temporibus sint expedita.</p>
            </div>
            <img id='section-one-info' src='https://png.pngtree.com/template/20221027/ourlarge/pngtree-sports-infographic-template-infograph-sport-image_1845839.jpg'/>
        </section>
        <section className='section-two'>
            <h2 className='section-two-desc' id="section-two-title">How Cleet Up! works</h2>
            <h3 className='section-two-desc'>1. Find a sports group in your area</h3>
            <h3 className='section-two-desc'>2. Join an event: free or paid</h3>
            <h3 className='section-two-desc'>3. CLEET UP!</h3>
        </section>
        <section className='section-three'>
            <div className='column-one column'>
                <img className="icon" src='https://www.clipartmax.com/png/full/467-4676556_stock-photography-join-hands-working-together-clip-art.png'/>
                <Link to={'/groups'} onClick={onClick} className='link'>See all groups</Link>
                <p>Find a group that is the best fit for you.</p>
            </div>
            <div className='column-two column'>
                <img className="icon" src='https://creazilla-store.fra1.digitaloceanspaces.com/icons/3204714/ticket-icon-md.png'/>
                <Link to={'/groups'} onClick={onClickE} className='link'>Find an event</Link>
                <p>Search upcoming events and jump right in the game</p>
            </div>
            <ColumnThree/>
        </section>
        <section className='section-four'>
            <button className='join'>Join Cleet Up!</button>
        </section>
        </span>
    )
}

export default LandingPage
