import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from '../../store/groups';
import { useEffect, useState } from 'react';
import EventGroupHeader from '../EventGroupHeader/EventGroupHeader';
import { GroupEvents } from './GroupEvents'
import './AllGroups.css'
import { useNavigate } from "react-router-dom";






const AllGroups = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
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
                    <div className='group-box' key={`groupbox${id}`}>
                        <section key={id} className='group-section' onClick={() => navigate(`/groups/${id}/details`)}>
                            <div className='img'>{previewImage}</div>
                            <h2 key={name} className='groupname'>{name}</h2>
                            <h3 key="location" className='location'>{`${city}, ${state}`}</h3>
                            <p key="description" className='about'>{about}</p>
                            <div className='numevents'>
                                <GroupEvents id={id} private={group.private}/>
                                <p className='center-dot'>.</p>
                                <p>{group.private ? 'Private' : 'Public'}</p>
                            </div>
                        </section>
                    </div>
                )
            })}
        </main>
    )
}

export default AllGroups
