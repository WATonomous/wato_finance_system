import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const usePreserveParamsNavigate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const oldSearchParams = new URLSearchParams(searchParams)
    return (path) => {
        navigate(`${path}?${oldSearchParams.toString()}`)
    }
}
export default usePreserveParamsNavigate
