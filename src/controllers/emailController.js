const nodemailer = require('nodemailer')
require('dotenv').config();

//Configura o transporte
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

//Rota para envio do email
exports.enviarEmail = async (req, res) => {
    const { to, subject, text } = req.body;

    // Permite que 'to' seja um array de e-mails ou um único e-mail
    const destinatarios = Array.isArray(to) ? to : [to];
    try {
        // Envia e-mails em paralelo
        const resultados = await Promise.all(
            destinatarios.map(destinatario =>
                transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: destinatario,
                    subject,
                    text
                })
            )
        );

        res.status(200).json({ mensagem: 'E-mails enviados com sucesso!', resultados });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao Enviar E-mail', error })
    }
}