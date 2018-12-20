const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: check user auth
    const item = await ctx.db.mutation.createItem({
      data: { ...args }
    }, info);

    return item;
  },

  async updateItem(parent, args, ctx, info) {
    // TODO: check user auth
    const { id, ...updates } = args;

    const item = await ctx.db.mutation.updateItem({
      data: { ...updates },
      where: { id }
    }, info);

    return item;
  },

  async deleteItem(parent, args, ctx, info) {
    // TODO: check user auth
    const { id } = args;
    const where = { id };

    // 1. find item
    const item = await ctx.db.query.item({ where }, `{ id title }`);

    // 2. check if user owns item or has permissions to delete it
    // TODO:

    // 3. delete item
    return await ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        email,
        password,
        permissions: { set: ['USER'] }
      }
    }, info);

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365  // 1 year cookie
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({
      where: { email: email.toLowerCase() }
    });

    console.log(user);


    // validate login
    if (!user) throw new Error(`No user for email ${email}`);
    if (!bcrypt.compare(password, user.password)) throw new Error(`Incorrect password!`);

    // Set token and cookie
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365  // 1 year cookie
    });

    // Remove hashed password from user data sent to client.
    delete user.password;

    return user;

  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');

    return { message: 'Logged out.' };
  }
};

module.exports = Mutations;
