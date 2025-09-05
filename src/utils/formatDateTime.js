function getFormattedDateTime() {
    const agora = new Date()
    const hora = agora.toLocaleTimeString('pt-BR')
    const data = agora.toLocaleDateString('pt-BR')

    return { hora, data }
}

module.exports = { getFormattedDateTime }