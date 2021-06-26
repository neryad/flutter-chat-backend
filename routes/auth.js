/*
    paht: /api/login

*/
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUser, renewToken } = require('../controller/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
  '/new',
  [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').isEmail(),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  '/',
  [
    check('email', 'el email es obligatorio').isEmail(),
    check('password', 'el password es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  loginUser
);

router.get('/renew', validarJwt, renewToken);

module.exports = router;
