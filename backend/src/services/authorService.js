const Author = require("../models/author");
const createAuthorService = async (data) => {
    try {
        // check name exists
        const author = await Author.findOne({ name: data.name });
        if (author) {
            return {
                status: "error",
                message: "Tên tác giả đã tồn tại!"
            };
        }
        // create new author
        let result = await Author.create({
            name: data.name,
            user_id: data.user_id
        });
        return result;
   
    } catch (error) {
      console.log(error);
      return null;
    }
  }

const getAuthorService = async () => {
    try {
        let result = await Author.find().populate('user_id');
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}


const updateAuthorService = async (id, data) => {
    try {
        let result = await Author.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
        );
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const deleteAuthorService = async (id) => {
    try {
        let result = await Author.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createAuthorService,
    getAuthorService,
    updateAuthorService,
    deleteAuthorService
}