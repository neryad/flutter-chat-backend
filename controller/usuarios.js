const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJwt } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const usuarios = await Usuario.find({ _id: { $ne: req.uid } })
    .sort('-online')
    .skip(desde)
    .limit(20);

  res.json({
    ok: true,
    usuarios,
  });
};

module.exports = {
  getUsuarios,
};
