import express from 'express';
import dotenv from 'dotenv';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'items',
        allowedFormats: ['jpg', 'png', 'jpeg'],
    },
});

const parser = multer({ storage });

// Fetch all items

router.get('/items', authMiddleware, async (req, res) => {
    try {
        const items = await pool.query("SELECT * FROM items ");
        res.json(items.rows);;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Can't fetch items" });
    }
});

//get an single item

router.get('/items/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const item = await pool.query(`SELECT * FROM items WHERE id = $1`, [id]);
        res.json(item.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//add an item

router.post('/items', authMiddleware, parser.single('image'), async (req, res) => {
    const { title, description, location, status, date_reported } = req.body;
    const imageUrl = req.file.path; // Cloudinary URL
    try {
        const addItem = await pool.query(`INSERT INTO items(title, description, 
                                          location, status, date_reported, url, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, location, status, date_reported, imageUrl, req.userId]);
        res.json(addItem.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Failed to add item" });
    }
});

//update an item

router.put('/items/:id', authMiddleware, async (req, res) => {
    const { title, description, location,  status, date_reported } = req.body;
    const { id } = req.params;

    try {
        const updateItem = await pool.query(`UPDATE items SET
                                             title = $1, description = $2, location =$3,
                                             status = $4, date_reported = $5 WHERE id = $6`, [title, description, location, status, date_reported, id]);
        res.json({ message: "item updated" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Can't update item" });
    }
});

router.delete('/items/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const deleteItem = await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
        res.json({ message: "item deleted" });
    } catch (error) {
        console.log(error.message);
    }
});

//get items uploaded by a particular user

router.get('/getUserItem', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(`
      SELECT 
        items.id AS item_id,
        items.title,
        items.url
      FROM items
      WHERE items.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Can't fetch items with user info" });
  }
});



//delete an item with a aprticular userID

router.delete('/deleteUserItem', authMiddleware, async (req, res) => {
    const { itemId } = req.body;
    const userId = req.userId;

    try {
        const deleteUserItem = await pool.query(`
            DELETE FROM items
            WHERE id = $1 AND user_id = $2
        `, [itemId, userId]);

        if (deleteUserItem.rowCount === 0) {
            return res.status(404).json({ message: "Item not found or not owned by user" });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Can't delete item" });
    }
});


// GET item details by ID
router.get('/items/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM items WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;