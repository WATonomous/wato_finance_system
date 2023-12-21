import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

export const usePreserveParamsNavigate = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const oldSearchParams = new URLSearchParams(searchParams)
    return (path) => {
        navigate(`${path}?${oldSearchParams.toString()}`)
    }
}

export const useGetPreserveParamsHref = () => {
    const [searchParams] = useSearchParams()
    const oldSearchParams = new URLSearchParams(searchParams)
    const newSearchParams =
        oldSearchParams.toString().trim() === ''
            ? ''
            : `?${oldSearchParams.toString()}`
    return (path) => `${path}${newSearchParams}`
}
