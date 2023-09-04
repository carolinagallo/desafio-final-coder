class User {
  constructor(props) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.email = props.email;
    this.age = props.age;
    this.password = props.password;
    this.isAdmin = props.isAdmin;
    this.role = props.role;
    this.cart = props.cart;
    this.lastConnection = props.lastConnection;
    this.documents = props.documents;
  }
}

export default User;
