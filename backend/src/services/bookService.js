const Book = require('../models/book');
const Author = require('../models/author');
const createBookService = async (data) => {
    try {
        // check name exists
        const book = await Book.findOne({ title: data.title });
        if (book) {
            return {
                status: "error",
                message: "Tên sách đã tồn tại!"
            };
        }
        // create new author
        let result = await Book.create({
            image: data.image,
            title: data.title,
            link: data.link,
            description: data.description,
            price: data.price,
            author_id: data.author_id
        });
        return result;
   
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  const getBookService = async (limit, page, searchKey) => {
    try {
        let query = {};

        if (searchKey) {
            // Decode the search key
            const decodedSearchKey = decodeURIComponent(searchKey);

            query.title = { $regex: decodedSearchKey, $options: 'i' };
            
            // result for search by title
            let result = await Book.find(query)
                .populate('author_id')
                .limit(limit)
                .skip(page * limit);
            
            // if no books are found by title, search by author name
            if (result.length === 0) {
                const authors = await Author.find({ name: { $regex: decodedSearchKey, $options: 'i' } });
                const authorIds = authors.map(author => author._id);

                // search by author name
                if (authorIds.length > 0) {
                    query = { author_id: { $in: authorIds } };
                    
                    result = await Book.find(query)
                        .populate('author_id')
                        .limit(limit)
                        .skip(page * limit);
                }
            }
            
            // results when have query
            const totalBook = await Book.countDocuments(query);

            return {
                status: 'ok',
                message: 'Get books successfully',
                data: result,
                total: totalBook,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalBook / limit),
            };
        } else {
            // no search key 
            const totalBook = await Book.countDocuments(query);
            const result = await Book.find(query)
                .populate('author_id')
                .limit(limit)
                .skip(page * limit);

            return {
                status: 'ok',
                message: 'Get books successfully',
                data: result,
                total: totalBook,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalBook / limit),
            };
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

//   const getBookService = async (limit, page, searchKey) => {
//     try {
//         const query = {};
        
//         if (searchKey) {
//             // Search by title
//             query.title = { $regex: searchKey, $options: 'i' };

//             // Search by author name
//             const authors = await Author.find({ name: { $regex: 'qqeqeweqe', $options: 'i' } });
//             const authorIds = authors.map(author => author._id);
//             console.log(authorIds)
//             if (authorIds.length > 0) {
//                 query.author_id = { $in: authorIds };
//             }
//         }

//         const totalBook = await Book.countDocuments(query);

//         const result = await Book.find(query)
//             .populate('author_id')
//             .limit(limit)
//             .skip(page * limit);

//         return {
//             status: 'ok',
//             message: 'Get books successfully',
//             data: result,
//             total: totalBook,
//             pageCurrent: Number(page),
//             totalPage: Math.ceil(totalBook / limit),
//         };
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// };

const updateBookService = async (id, data) => {
    try {
        let result = await Book.findOneAndUpdate(
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

const deleteBookService = async (id) => {
    try {
        let result = await Book.findByIdAndDelete(id);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createBookService,
    getBookService,
    updateBookService,
    deleteBookService
}