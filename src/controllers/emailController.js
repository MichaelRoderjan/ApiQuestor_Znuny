const nodemailer = require('nodemailer');

exports.enviarEmail = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ mensagem: 'Corpo da requisição inválido.' });
        }

        const { to, subject, text, email, password, attachments } = req.body;

        if (!to || !subject || !text || !email || !password) {
            return res.status(400).json({
                erro: 'Campos obrigatórios ausentes. Necessário: to, subject, text, email, password'
            });
        }

        const destinatarios = Array.isArray(to) ? to.filter(Boolean) : [to];

        const anexosFormatados = Array.isArray(attachments)
            ? attachments
                .filter(file => file && file.filename && file.content)
                .map(file => ({
                    filename: file.filename,
                    content: file.content,
                    encoding: file.encoding || 'base64',
                    contentType: file.contentType || 'application/octet-stream'
                }))
            : [];

        console.log('Attachments recebidos:', attachments);
        console.log('Attachments formatados:', anexosFormatados);

        const transporter = nodemailer.createTransport({
            host: 'mail.smtp2go.com',
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        });

        const resultados = await Promise.all(
            destinatarios.map(destinatario =>
                transporter.sendMail({
                    from: email,
                    to: destinatario,
                    subject,
                    text,
                    attachments: anexosFormatados
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