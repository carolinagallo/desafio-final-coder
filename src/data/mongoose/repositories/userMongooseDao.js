import { userModel } from "../model/user.model.js";
import User from "../../../domain/entities/user.js";
import Role from "../../../domain/entities/role.js";

class UserMongooseRepository {
  async paginate(criteria) {
    const { limit, page } = criteria;
    const userDocuments = await userModel.paginate({}, { limit, page });
    const { docs, ...pagination } = userDocuments;

    const users = docs.map(
      (document) =>
        new User({
          id: document._id,
          firstName: document.firstName,
          lastName: document.lastName,
          email: document.email,
          age: document.age,
          isAdmin: document.isAdmin,
          lastConnection: document.lastConnection,
          role: document.role
            ? new Role(
                document.role.id,
                document.role.name,
                document.role.permissions
              )
            : null,
        })
    );

    return {
      users,
      pagination,
    };
  }

  async create(data) {
    const userDocument = await userModel.create(data);
    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      isAdmin: userDocument?.isAdmin,
      role: userDocument?.role,
      cart: userDocument?.cart,
    });
  }

  async getOne(id) {
    const userDocument = await userModel.findOne({ _id: id });

    if (!userDocument) {
      throw new Error("user no exist");
    }
    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      isAdmin: userDocument?.isAdmin,
      lastConnection: userDocument?.lastConnection,
      role: userDocument?.role,
      cart: userDocument?.cart,
    });
  }

  async getAll() {
    const usersDocument = await userModel.find();

    if (!usersDocument) {
      throw new error("users no exists");
    }
    const users = usersDocument.map(
      (user) =>
        new User({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
          password: user.password,
          isAdmin: user?.isAdmin,
          lastConnection: user?.lastConnection,
          role: null,
          cart: null,
        })
    );
    return users;
  }

  async addAndUpdate(id, data) {
    const userDocument = await userModel.findOneAndUpdate(
      { _id: id },
      { $push: data },
      { new: true }
    );

    if (!userDocument) {
      throw new Error("dont updated document");
    }
    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      isAdmin: userDocument?.isAdmin,
      documents: userDocument?.documents,
    });
  }
  async updateOne(id, data) {
    const userDocument = await userModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    if (!userDocument) {
      throw new Error("User dont exist");
    }
    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      isAdmin: userDocument?.isAdmin,
      role: userDocument?.role,
      cart: userDocument.cart,
      documents: userDocument?.documents,
    });
  }

  async getOneByEmail(email) {
    const userDocument = await userModel.findOne({ email });

    if (!userDocument) throw new Error("usuario no existe");

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      isAdmin: userDocument?.isAdmin,
      role: userDocument?.role,
      cart: userDocument.cart,
      documents: userDocument.documents,
    });
  }

  async deleteOne(id) {
    return userModel.deleteOne({ _id: id });
  }

  async updateRole(id) {
    const userDocument = await userModel.findOne({ _id: id }).populate("role");
    if (!userDocument) throw new Error("usuario no existe");

    const rolPremium = "64a34764ddca659c18f12603";
    const rolUser = "6477bdc5bf7bff413f8d2df2";

    if (userDocument.role.name == "user") {
      await userModel.updateOne({ _id: id }, { $set: { role: rolPremium } });
    }
    if (userDocument.role.name == "premium") {
      await userModel.updateOne({ _id: id }, { $set: { role: rolUser } });
    }

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      age: userDocument.age,
      password: userDocument.password,
      isAdmin: userDocument?.isAdmin,
      role: userDocument?.role,
      cart: userDocument.cart,
      documents: userDocument.documents,
    });
  }
}
export default UserMongooseRepository;
