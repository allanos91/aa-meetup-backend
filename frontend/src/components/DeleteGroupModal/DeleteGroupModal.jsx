import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { removeGroup } from '../../store/groups'
import { useIsDeletedObj } from '../../context/IsDeleted'
import { refreshEvents } from '../../store/events'


function DeleteGroupModal(groupId) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const { setIsDeleted } = useIsDeletedObj()

    const onClick = () => {
        return dispatch(removeGroup(groupId.groupId))
        .then(closeModal)
        .then(dispatch(refreshEvents()))
        .then(setIsDeleted(true))
    }

    const onClickClose = () => {
        return closeModal()
    }


    return (
        <>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to remove this group?</h2>
        <div className='options'>
            <button onClick={onClick}>Yes</button>
            <button onClick={onClickClose}>No</button>
        </div>
        </>
    )
}


export default DeleteGroupModal
