const {
  createAuthorService,
  getAuthorService,
  updateAuthorService,
  deleteAuthorService,
} = require("../services/authorService");

const createAuthor = async (req, res) => {
  try {
    const data = await createAuthorService(req.body);

    return res.status(201).json({
      status: "ok",
      message: "Author created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAuthorList = async (req, res) => {
  try {
    const data = await getAuthorService();

    return res.status(201).json({
      status: "ok",
      message: "Get Author successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateAuthor = async (req, res) => {
  const author_id = req.params.id;
  const value = req.body;

  const data = await updateAuthorService(author_id, value);

  return res.status(200).json({
    status: "ok",
    message: "Author updated successfully",
    data: data,
  });
};

const deleteAuthor = async (req, res) => {
  const id = req.params.id;

  const data = await deleteAuthorService(id);

  return res.status(200).json({
    status: "ok",
    message: "Author deleted successfully",
    data: null,
  });
};

module.exports = {
  createAuthor,
  getAuthorList,
  updateAuthor,
  deleteAuthor,
};
