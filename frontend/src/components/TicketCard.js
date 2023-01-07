import React, { useState, useEffect } from 'react'
import axios from 'axios'

const TicketCard = () => {
    const [tickets, setTickets] = useState([])

    const retrieveData = () => {
        axios
            .get(`http://localhost:5000/entities/`)
            .then((res) => {
                setTickets(sortedData(res.data))
                console.log(res.data)
                // console.log(sortedData(res.data))
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        retrieveData()
    }, [])

    const sortedData = (array) => {
        array.sort(function (a, b) {
            var keyA = new Date(a.createdAt),
                keyB = new Date(b.createdAt)
            // Compare the 2 dates
            if (keyA < keyB) return -1
            if (keyA > keyB) return 1
            return 0
        })
        return array
    }

    return (
        <div>
            hi
            {tickets.map((ticket, i) => (
                <div key={i}>{ticket.sf_id? | </div>
            ))}
        </div>
    )
}

export default TicketCard
