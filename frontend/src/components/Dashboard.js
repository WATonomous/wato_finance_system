import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import TicketList from './TicketList'
import Navbar from './Navbar'

const Dashboard = (props) => {
    const [error, setError] = useState('')
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [sfData, setSFData] = useState([])
    const [fiData, setFIData] = useState([])
    const [pprData, setPPRData] = useState([])
    const [uprData, setUPRData] = useState([])

    const getAllTickets = () => {
        axios
            .get('http://localhost:5000/sponsorshipfunds/')
            .then(response => setSFData(response.data))
        axios
            .get('http://localhost:5000/fundingitems/')
            .then(response => setFIData(response.data))
        axios
            .get('http://localhost:5000/personalpurchases/')
            .then(response => setPPRData(response.data))
        axios
            .get('http://localhost:5000/uwfinancepurchases/')
            .then(response => setUPRData(response.data))
    }

    useEffect(() => {
        // const path = location.pathname
        // console.log(path)
        getAllTickets()
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch {
            setError('Log out failed, try again')
        }
    }

    return (
        <>
            <Navbar onClick={handleLogout} authButtonText={error ? error : 'Log Out'}/>
            <TicketList
                sfData={sfData}
                fiData={fiData}
                pprData={pprData}
                uprData={uprData}
            />
        </>
    )
}

export default Dashboard
