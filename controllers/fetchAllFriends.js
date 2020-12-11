const Friends = require('../models/friends.js');

export const fetchAllFriends = () => {
  Friends.find(
    {
      $and: [
        { accepted: true },
        {
          $or: [{ senderUserId: req.user.id }, { receiverUserId: req.user.id }],
        },
      ],
    },
    async (err, doc) => {
      try {
        if (err) throw err;
        if (!doc) return [];
        if (doc) {
          const friendsArray = doc.map((x) => {
            if (x.senderUserId === req.user.id) {
              return x.receiverUserId;
            } else return x.senderUserId;
          });
          return { friends: friendsArray };
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
};
