function getUserLoginTareffa() {
    const getAll = {
        'TAREFFA_CLIENT_ID': process.env.TAREFFA_CLIENT_ID,
        'TAREFFA_CLIENT_SECRET': process.env.TAREFFA_CLIENT_SECRET,
        'TAREFFA_USERNAME': process.env.TAREFFA_USERNAME,
        'TAREFFA_PASSWORD': process.env.TAREFFA_PASSWORD
    }

    return getAll
}

module.exports = { getUserLoginTareffa }