import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Create a new book
router.post('/', async (req: Request, res: Response) => {
  try {
    const bookData = req.body;
    const result = await booksCollection.insertOne(bookData);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Could not create the book' });
  }
});

// Get all books
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await booksCollection.find().toArray();
    res.json(books);
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ error: 'Could not retrieve books' });
  }
});

// Add more routes for updating, deleting, and getting single books as needed

export default router;
