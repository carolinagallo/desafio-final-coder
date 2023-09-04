import UserManager from "../../domain/managers/users.js";
import userUpdateValidation from "../../domain/validations/user/userUpdateValidations.js";
import userCreateValidation from "../../domain/validations/user/userCreateValidations.js";
import { createHash } from "../../shared/index.js";
import moment from "moment";

export const list =
  ("/",
  async (req, res, next) => {
    try {
      const { limit, page } = req.query;

      const userManager = new UserManager();

      const users = await userManager.paginate({ limit, page });

      res.send({
        status: "success",
        users: users.docs,
        ...users,
        docs: undefined,
      });
    } catch (e) {
      next(e);
    }
  });

export const getOne =
  ("/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const userManager = new UserManager();

      const user = await userManager.getOne(id);

      res.send({ status: "success", user });
    } catch (e) {
      next(e);
    }
  });

export const save =
  ("/",
  async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        password: await createHash(req.body.password, 10),
      };

      await userCreateValidation.parseAsync(data);
      const userManager = new UserManager();

      const user = await userManager.create(data);

      res.send({ status: "success", user, massage: "user created" });
    } catch (e) {
      next(e);
    }
  });

export const update =
  ("/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;

      await userUpdateValidation.parseAsync(data);

      const userManager = new UserManager();

      const user = await userManager.updateOne(id, data);

      res.send({ status: "success", user, massage: "user updated" });
    } catch (e) {
      next(e);
    }
  });

export const deleteOne =
  ("/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const userManager = new UserManager();

      await userManager.deleteOne(id);

      res.send({ status: "success", massage: "user deleted" });
    } catch (e) {
      next(e);
    }
  });

export const updateRol =
  ("/premium/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = req.user;

      const userManager = new UserManager();
      const userUpdated = await userManager.updateRol(id, user);

      res.send({ status: "success", userUpdated, massage: "user updated" });
    } catch (e) {
      res.status(404).send(e.message);
    }
  });

export const addDocuments =
  ("/:id/documents",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const archive = `http://localhost:8084/${req.file.path.replace(
        "public/",
        ""
      )}`;
      data.reference = archive;

      const userManager = new UserManager();

      const user = await userManager.addDocuments(id, data);

      res.send({ status: "success", user, massage: "document uploader" });
    } catch (e) {
      next(e);
    }
  });

export const deleteForInactivity =
  ("/inactividad",
  async (req, res, next) => {
    try {
      const userManager = new UserManager();
      const users = await userManager.getAll();

      for (const user of users) {
        const lastConnection = moment(user.lastConnection);
        const timeSinceLastConnection = moment().diff(lastConnection, "hours");

        if (timeSinceLastConnection >= 48) {
          await userManager.deleteOne(user.id);
        }
      }
      res.send({ status: "success", massage: "users geted" });
    } catch (e) {
      next(e);
    }
  });
