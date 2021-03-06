const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  item: forwardTo('db'),
  me(parent, args, ctx, info) {
    // check if no user logged in
    if (!ctx.request.userId) return null;

    return ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info);
  }
};

module.exports = Query;
