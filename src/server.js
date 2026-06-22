const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    // Obtém o IP real do cliente, mesmo atrás de proxies
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Se o IP for inválido (ex: localhost), retorna um erro (mas na produção isso não ocorre)
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
        return res.status(400).json({ error: 'IP não válido para geolocalização' });
    }

    try {
        // Consulta a ip-api.com com o IP real
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=countryCode`);
        const countryCode = response.data.countryCode || 'XX';
        res.json({ countryCode });
    } catch (error) {
        console.error('Erro na consulta:', error.message);
        res.status(500).json({ error: 'Falha ao obter geolocalização' });
    }
});

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
