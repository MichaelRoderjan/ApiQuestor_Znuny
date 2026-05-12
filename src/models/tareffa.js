function getUserLoginTareffa() {
    const getAll = {
        'TAREFFA_CLIENT_ID': process.env.TAREFFA_CLIENT_ID,
        'TAREFFA_CLIENT_SECRET': process.env.TAREFFA_CLIENT_SECRET,
        'TAREFFA_USERNAME': process.env.TAREFFA_USERNAME,
        'TAREFFA_PASSWORD': process.env.TAREFFA_PASSWORD,
        'USERLOGIN': process.env.USERLOGIN,
        'PASSWORD': process.env.PASSWORD,
        'CERT_USER': process.env.CERT_USER,
        'CERT_PASSWORD': process.env.CERT_PASSWORD
    }

    return getAll
}

module.exports = { getUserLoginTareffa }