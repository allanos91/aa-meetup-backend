import { Link } from 'react-router-dom'


const EventGroupHeader = () => {
    return (
        <div className='event-group-header'>
            <Link>Events</Link>
            <Link>Groups</Link>
            <p>Groups in Cleet Up!</p>
        </div>
    )
}

export default EventGroupHeader
