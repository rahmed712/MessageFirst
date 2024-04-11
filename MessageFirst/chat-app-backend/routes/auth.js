const {
  signup,
  login,
  setAvatar,
  getAllUsers,
  logOut,
} = require("../controllers/usersController");

const router = require("express").Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
