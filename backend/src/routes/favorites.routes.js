
const express = require("express");
const router = express.Router();
const FavoritesController = require("../controllers/favorites.controller");
const { requireAuth } = require("../middlewares/auth");

const controller = new FavoritesController();

router.get('/', requireAuth, (req,res,next) => controller.listUserFavorites(req,res,next));
router.post('/', requireAuth, (req,res,next) => controller.addFavorite(req,res,next));
router.delete('/:bookId', requireAuth, (req,res,next) => controller.removeFavorite(req,res,next));

module.exports = router;
