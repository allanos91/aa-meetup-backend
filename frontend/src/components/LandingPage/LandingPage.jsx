import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import './LandingPage.css'

const LandingPage = () => {
    const isLoggedIn = useSelector(state => state.session.user)
    const ColumnThree = () => {
        if (!isLoggedIn) {
            return (
            <div className='column-three'>
                <p>Icon here</p>
                <p className='disabled-link'>Start a new group</p>
                <p>caption</p>
            </div>
            )
        } else {
            return (
            <div className='column-three'>
                <p>Icon here</p>
                <Link>Start a new group</Link>
                <p>caption</p>
            </div>
            )
        }
    }

    return (
        <span>
        <section className='section-one'>
            <p id='section-one-desc'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste aperiam eveniet dolore nobis molestias cupiditate, culpa voluptate a, magni aliquid quidem. Beatae autem nesciunt fuga facilis neque temporibus sint expedita.</p>
            <p id='section-one-info'> THIS IS WHERE INFOGRAPH GOES</p>
        </section>
        <section className='section-two'>
            <h2 className='section-two-desc' id="section-two-title">How Cleet Up! works</h2>
            <h3 className='section-two-desc'>1. Find a sports group in your area</h3>
            <h3 className='section-two-desc'>2. Join an event: free or paid</h3>
            <h3 className='section-two-desc'>3. CLEET UP!</h3>
        </section>
        <section className='section-three'>
            <div className='column-one'>
                <p>Icon here</p>
                <Link to={'/groups'}>See all groups</Link>
                <p>caption</p>
            </div>
            <div className='column-two'>
                <p>Icon here</p>
                <Link>Find an event</Link>
                <p>caption</p>
            </div>
            <ColumnThree/>
        </section>
        <section className='section-four'>
            <button>Join Cleet Up!</button>
        </section>
        </span>
    )
}

export default LandingPage
