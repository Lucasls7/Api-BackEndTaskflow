const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado" });
  }

  // Garante a separação do esquema "Bearer "
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
    return res.status(401).json({ erro: "Formato inválido. Use: Bearer <token>" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    return next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError") {
      return res.status(401).json({ erro: "Token expirado. Faça login novamente." });
    }

    return res.status(401).json({ erro: "Token inválido." });
  }
}

module.exports = autenticar;