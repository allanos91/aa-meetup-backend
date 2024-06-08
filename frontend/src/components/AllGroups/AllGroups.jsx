import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from '../../store/groups';
import { useEffect } from 'react';
import EventGroupHeader from '../EventGroupHeader/EventGroupHeader';
import { GroupEvents } from './GroupEvents'
import './AllGroups.css'



const AllGroups = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getGroups())
    },[])

    const groups = useSelector((state) => {
        return Object.values(state.groups)
    })

    return (
        <main>
            <EventGroupHeader/>
            {groups.map(group => {
                const {previewImage, name, about, city, state, id} = group
                return (
                    <section key={id} className='group-section'>
                    <div className='img'>{previewImage} Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias id repellendus nulla. Ullam quibusdam culpa vitae deleniti aliquam aspernatur perspiciatis, dicta nihil a delectus voluptas? Veritatis, consequatur? Cumque, reiciendis expedita!</div>
                    <h2 key={name} className='groupname'>{name}</h2>
                    <h3 key="location" className='location'>{`${city}, ${state}`}</h3>
                    <p key="description" className='about'>{about}</p>
                    <div className='numevents'>
                    <GroupEvents id={id} private={group.private}/>
                    <p className='center-dot'>.</p>
                    <p>{group.private ? 'Private' : 'Public'}</p>
                    </div>
                    </section>
                )
            })}
        </main>
    )
}

export default AllGroups
