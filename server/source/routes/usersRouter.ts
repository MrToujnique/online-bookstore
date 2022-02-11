import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import passport from 'passport';
import { getConnection, createQueryBuilder, getRepository } from 'typeorm';
import { generateToken, isAuth } from '../../utils';
import { Users } from './../entity/Users';
import { isAdmin } from './../../utils';
import { SubOrder } from '../entity/SubOrder';

const router = express.Router();
const bcrypt = require('bcryptjs');

router.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
      const user = await Users.findOne({ email: req.body.email });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.status(200).send({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role,
            token: generateToken(user),
          });
        }
        else res.status(401).send({message: "Niepoprawne haslo."});
      }
      else res.status(401).send({ message: "Niepoprawny email." });
    })
  );

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/logowanie');
  });

router.post(
    '/register', expressAsyncHandler(async (req, res) => {
        const {firstName, lastName, email, password} = req.body;
        try {
            const existingUser =
                (await getConnection()
                    .createQueryBuilder()
                    .select('user')
                    .from(Users, 'user')
                    .where('user.email = :email', { email: email })
                    .getCount()) > 0;
            const passHash: string = await bcrypt.hash(password, 8);
            if (!existingUser) {
                const newUser = Users.create({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: passHash
                });

                const createdUser = await newUser.save();

                res.status(200).send({
                    id: createdUser.id,
                    first_name: createdUser.first_name,
                    last_name: createdUser.last_name,
                    email: createdUser.email,
                    role: createdUser.role,
                    token: generateToken(createdUser),
                })
            } else {
                res.status(401).send({ message: 'Taki uzytkownik juz istnieje.'});
            }
        } catch (e) {
            throw e;
        }
    })
);

router.get(
    "/users/:id",
    expressAsyncHandler(async (req, res) => {
      const user = await Users.find({where: {id: req.params.id}});
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: "Nie znaleziono uzytkownika" });
      }
    })
  );

router.put(
    "/users/profile",
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const user = await Users.findOne({where: {id: req.body.id}});
      if (user) {
        user.first_name = req.body.first_name || user.first_name;
        user.last_name = req.body.last_name || user.last_name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updatedUser = await user.save();

        res.send({
          id: updatedUser.id,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          email: updatedUser.email,
          role: updatedUser.role,
          token: generateToken(updatedUser),
        });
      }
    })
  );

router.delete(
    "/user/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await Users.findOne({where: {id: req.params.id}});
      if (user) {
        if (user.role === "admin") {
          res.status(400).send({ message: "Nie mozna usunac konta administratora." });
          return;
        }
        const deleteUser = await user.remove();
        res.send({ message: "Uzytkownik usuniety.", user: deleteUser });
      } else {
        res.status(404).send({ message: "Nie znaleziono uzytkownika." });
      }
    })
  );

router.put(
    "/user/:id",
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await Users.findOne({where: {id: req.params.id}});
      if (user) {
        user.first_name = req.body.first_name || user.first_name;
        user.last_name = req.body.last_name || user.last_name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();
        
        res.send({ message: "Użytkownik zaktualizowany", user: updatedUser });
      } else {
        res.status(404).send({ message: "Nie znaleziono użytkownika" });
      }
    })
  );

export { router as usersRouter };
