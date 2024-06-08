import { useParams } from "react-router-dom"

const GroupDetails = () => {
    let {groupId} = useParams()
    console.log(groupId)
    return (
        <p>Hello World</p>
    )
}

export default GroupDetails
