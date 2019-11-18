exports.formatDates = list => { const newList = [...list];
  return newList.map(({ created_at, ...otherKeys }) => {
    created_at = new Date(created_at);
    return { created_at, ...otherKeys };
  });};

exports.makeRefObj = list => {let emptyObj = {};
  list.forEach(objectInside => {
    let main = objectInside.article_id;
    let main2 = objectInside.title;
    emptyObj[main2] = main;
  });
  return emptyObj;};

exports.formatComments = (comments, articleRef) => {let newArray = comments.map(comment => ({
    body: comment.body,
    article_id: articleRef[comment.belongs_to],
    author: comment.created_by,
    votes: comment.votes,
    created_at: new Date(comment.created_at)
  }));
  return newArray;};
