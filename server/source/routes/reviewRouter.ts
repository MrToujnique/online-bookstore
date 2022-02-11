import express from 'express';
import { Review } from './../entity/Review';
import { Book } from './../entity/Book';
import { isAuth } from '../../utils';
import expressAsyncHandler from 'express-async-handler';
import { getConnection } from 'typeorm';
import { Users } from './../entity/Users';

const router = express.Router();

router.get('/api/reviews', async (req, res) => {
    const data = await Review.find({
        join: {
            alias: 'review',
            leftJoinAndSelect: {
                book: 'review.book'
            }
        }
    });
    return res.json(data);
});

router.post('/review/:bookId', expressAsyncHandler(async (req, res) => {
    const { bookId } = req.params;
    const { rating, content, name, user_id } = req.body;


    const book = await Book.findOne(parseInt(bookId));
    const user = await Users.findOne(parseInt(user_id));
    
        
    const review = await Review.create({ rating: rating, content: content, name: name, book: book, users: user });
    
    await review.save();
    
    res.json(review);
    }
));

export { router as reviewRouter };
