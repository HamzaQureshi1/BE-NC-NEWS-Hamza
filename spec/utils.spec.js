const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when passed an empty array returns an empty array", () => {
    const input = [];
    const result = formatDates(input);
    const expected = [];
    expect(result).to.eql(expected);
  });
  it("when passed an array of objects with one which contains a timestamp its converted into a javascript date object", () => {
    const input = [
      {
        comment_id: "1",
        author: "me",
        article_id: "2",
        votes: 0,
        created_at: 20191028105145,
        body: "etc"
      }
    ];
    const result = formatDates(input);
    const expected = [
      {
        comment_id: "1",
        author: "me",
        article_id: "2",
        votes: 0,
        created_at: new Date(20191028105145),
        body: "etc"
      }
    ];
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        comment_id: "1",
        author: "me",
        article_id: "2",
        votes: 0,
        created_at: 20191028105145,
        body: "etc"
      }
    ];
    const inputCopy = [
      {
        comment_id: "1",
        author: "me",
        article_id: "2",
        votes: 0,
        created_at: 20191028105145,
        body: "etc"
      }
    ];
    formatDates(input);
    expect(input).to.eql(inputCopy);
  });
});

describe("makeRefObj", () => {
  it("takes an empty  array and returns an empty object", () => {
    const result = makeRefObj([]);
    const expected = {};
    expect(result).to.eql(expected);
  });
  it("takes an array which contains an object with article_id and title  and returns an object with the just the keys from the object", () => {
    const input = [{ article_id: 1, title: "A" }];
    const result = makeRefObj(input);
    const expected = { A: 1 };
    expect(result).to.eql(expected);
  });
  it("takes more than one  array which contains an object with article_id and title  and returns an object with the just the keys from the object", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" }
    ];
    const result = makeRefObj(input);
    const expected = { A: 1, B: 2 };
    expect(result).to.eql(expected);
  });
  it("takes AN array which contains an object with article_id and title and another key  and returns an object with the just the keys from article id and title from the object", () => {
    const input = [{ article_id: 1, title: "A", title_id: 2 }];
    const result = makeRefObj(input);
    const expected = { A: 1 };
    expect(result).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("takes an empty array and returns an array", () => {
    const input = [];
    const result = formatComments(input);
    const expected = [];
    expect(result).to.eql(expected);
  });
  it("takes a single comment object and a reference object and returns a new array of formatted comments ", () => {
    const input = [
      {
        body: "HELLO",
        belongs_to: "ME",
        created_by: "A",
        votes: 2,
        created_at: 20191028105145
      }
    ];
    const referenceObject = { ME: 4 };
    const result = formatComments(input, referenceObject);
    const expected = [
      {
        body: "HELLO",
        article_id: 4,
        author: "A",
        votes: 2,
        created_at: new Date(20191028105145)
      }
    ];
  });
});
