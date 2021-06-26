const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const existeEmail = await Usuario.findOne({ email: email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya esta registrado',
      });
    }

    const usuario = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    //Generar JWT
    const token = await generarJwt(usuario.id);
    res.json({
      ok: true,
      msg: 'Crear usuario!!!',
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error en servidor!!!',
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const userDb = await Usuario.findOne({ email });

    if (!userDb) {
      return res.status(404).json({
        ok: false,
        msg: 'Email no encontrado',
      });
    }

    //Validar el apssword

    const validPassword = bcrypt.compareSync(password, userDb.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales incorrecta',
      });
    }

    const token = await generarJwt(userDb.id);

    return res.json({
      ok: true,
      msg: 'login',
      userDb,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error 500',
      err: error,
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  const token = await generarJwt(uid);

  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUser,
  renewToken,
};
