import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from '../../store/groups';
import { useEffect } from 'react';
import EventGroupHeader from '../EventGroupHeader/EventGroupHeader';
import { GroupEvents } from './GroupEvents'



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
                const {previewImage, name, about, city, state, type, id} = group
                // console.log('flag1',groups)
                return (
                    <section key={id} className='group-section'>
                    <div>{previewImage}</div>
                    <h2 key={name}>{name}</h2>
                    <h3 key="location">{`${city}, ${state}`}</h3>
                    <p key="description">{about}</p>
                    <GroupEvents id={id}/>
                    <p>{type}</p>
                    </section>
                )
            })}
        </main>
    )
}

export default AllGroups
