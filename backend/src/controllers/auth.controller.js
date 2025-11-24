const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');

class AuthController {
  constructor() {
    this.usersRepo = new UsersRepository();
  }

  async register(req, res, next) {
    try {
      const { username, email, nomeCompleto, password } = req.body;
      if (!username || !email || !nomeCompleto || !password) {
        return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
      }

      const userExist = await this.usersRepo.findByUsername(username);
      if (userExist) return res.status(409).json({ erro: 'Usuário já existe.' });

      const emailExist = await this.usersRepo.findByEmail(email);
      if (emailExist) return res.status(409).json({ erro: 'Email já cadastrado.' });

      const hash = await bcrypt.hash(password, 10);
      const user = await this.usersRepo.create({ username, email, nomeCompleto, passwordHash: hash });

      req.session.userId = user.id;
      res.status(201).json({ mensagem: 'Usuário registrado com sucesso!', user: user.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  // login, me, logout continuam iguais
}

module.exports = AuthController;