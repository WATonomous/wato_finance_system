const sendEmail = (email) => {
    axios
        .post('http://localhost:5000/emails', email)
        .then((res) => console.log(res.data))
}

export default sendEmail
