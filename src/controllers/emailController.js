const nodemailer = require('nodemailer');
require('dotenv').config();

exports.enviarEmail = async (req, res) => {
    const { to, subject, text } = req.body;
    const destinatarios = Array.isArray(to) ? to : [to];
    const getEmail = req.query.email || process.env.EMAIL_USER;
    const getPassword = req.query.password || process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 465,
        secure: true,
        auth: {
            user: getEmail,
            pass: getPassword
        }
    });

    try {
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
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ mensagem: 'Erro ao Enviar E-mail', error });
    }
};
