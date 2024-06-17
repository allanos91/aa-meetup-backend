import { useModal } from '../../context/Modal';


export function OpenModalButton({modalComponent, buttonText, onButtonClick, onModalClose}) {
    const { setModalContent, setOnModalClose} = useModal()

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === 'function') onButtonClick();
    }

    const className = (name) => {
        return name.toLowerCase() + '-button'
    }

    return <button className={className(buttonText)} onClick={onClick}>{buttonText}</button>

}

export default OpenModalButton;
