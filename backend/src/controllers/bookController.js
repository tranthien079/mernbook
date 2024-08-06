
const { createBookService, getBookService, updateBookService, deleteBookService } = require("../services/BookService")

const createBook = async (req, res) => {
    try {
        const data = await createBookService(req.body)
        if(data) {
            return  res.status(201).json({
                status: 'ok',
                message: 'Book created successfully',
                data: data,
            })
        }
    } catch (error) {
        console.log(error);
        return null;
    }
   
}

const getBookList = async (req, res) => {
    try {
        const { limit , page,  searchKey } = req.query;
        const data = await getBookService(Number(limit) || 12, Number(page) || 0, searchKey || '')
        if(data) {
            return  res.status(200).json(data);
        } 
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateBook = async (req, res) => {
    const Book_id = req.params.id;
    const value = req.body;

    const data = await updateBookService(Book_id, value)

    return res.status(200).json({
        status: 'ok',
        message: 'Book updated successfully',
        data: data,
    })
}

const deleteBook = async (req, res) => {
    const id = req.params.id;

    const data = await deleteBookService(id)

    return res.status(200).json({
        status: 'ok',
        message: 'Book deleted successfully',
        data: null,
    })
}

module.exports = { 
    createBook,
    getBookList,
    updateBook,
    deleteBook
 }