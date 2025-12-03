const nodemailer = require('nodemailer');
// require('dotenv').config();

exports.enviarEmail = async (req, res) => {

    try {
        // 1) Garante que req.body existe e é um objeto
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ mensagem: 'Corpo da requisição inválido.' });
        }

        // 2) Pega todos os campos de uma vez
        const { to, subject, text, email, password } = req.body;

        // 3) Validação básica dos campos obrigatórios
        if (!to || !subject || !text || !email || !password) {
            return res.status(400).json({
                erro: 'Campos obrigatórios ausentes. Necessário: to, subject, text, email, password'
            });
        }

        // 4) Normaliza destinatários para sempre ser array
        const destinatarios = Array.isArray(to) ? to.filter(Boolean) : [to];

        // 5) Cria o transporter com as credenciais
        const transporter = nodemailer.createTransport({
            host: 'mail.smtp2go.com',
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        })

        // 6) Envia para todos os destinatários
        const resultados = await Promise.all(
            destinatarios.map(destinatario =>
                transporter.sendMail({
                    from: email,
                    to: destinatario,
                    subject,
                    text
                })
            )
        );
        return res.status(200).json({
            mensagem: 'E-mails enviados com sucesso!',
            resultados
        });

    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({
            mensagem: 'Erro ao Enviar E-mail',
            erro: String(error)
        });
    }
};
