import { useEventHeader } from '../../context/EventHeader'

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
        <div className='event-group-header'>
            <p className={eventClassName()} onClick={onClickE}>Events</p>
            <p className={groupClassName()} onClick={onClickG}>Groups</p>
            <p>{textGE()} in Cleet Up!</p>
        </div>
    )
}

export default EventGroupHeader
