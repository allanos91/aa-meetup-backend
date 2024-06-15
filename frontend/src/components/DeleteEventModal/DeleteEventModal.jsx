import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { removeEvent } from '../../store/events'
import { useIsDeletedObj } from '../../context/IsDeleted'

function DeleteEventModal(eventId) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const { setIsDeleted} = useIsDeletedObj()

    const onClick = () => {
        return dispatch(removeEvent(eventId.eventId))
        .then(closeModal)
        .then(setIsDeleted(true))
    }

    const onClickClose = () => {
        return closeModal()
    }

    return (
        <>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to remove this event?</h2>
        <div className='options'>
            <button onClick={onClick}>Yes</button>
            <button onClick={onClickClose}>No</button>
        </div>
        </>
    )
}

export default DeleteEventModal
