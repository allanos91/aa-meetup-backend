import { useEventHeader } from '../../context/EventHeader'
import "./EventGroupHeader.css"

const EventGroupHeader = () => {
    const {isGrayG, setIsGrayG} = useEventHeader()
    const {isGrayE, setIsGrayE} = useEventHeader()

    const onClickG = () => {
        setIsGrayE('gray')
        setIsGrayG('')
    }

    const onClickE = () => {
        setIsGrayG('gray')
        setIsGrayE('')
    }

    let textGE = () => {
        if (isGrayG) {
            return 'Events'
        } else {
            return 'Groups'
        }
    }

    const eventClassName = () => {
        return 'event-header ' + isGrayE
    }

    const groupClassName = () => {
        return 'group-header ' + isGrayG
    }

    return (
        <div className='group-header-box'>
        <div className='event-group-header test'>
            <div className='event-group-buttons'>
            <p className={eventClassName()} onClick={onClickE}>Events</p>
            <p className={groupClassName()} onClick={onClickG}>Groups</p>
            </div>
            <p className='second-row'>{textGE()} in Cleet Up!</p>
        </div>
        </div>
    )
}

export default EventGroupHeader
