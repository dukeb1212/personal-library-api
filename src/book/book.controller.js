const pool = require('../../database');

exports.syncServerToLocal = async (req, res) => {
    try {
        const userId = req.userData.id;

        // Fetch books added by the user
        const bookResult = await pool.query(`
            SELECT  ab.book_id, b.title, b.subtitle, b.published_date, b.description, 
                    b.total_pages, b.language, b.image_links, c.name as category_name,
                    ab.buy_date, ab.last_read_date, ab.last_page_read, ab.percent_read,
                    ab.total_read_hours, ab.favorite, ab.last_seen_place, ab.quotation,
                    ab.comment, COALESCE(string_agg(a.name, ', '), '') as author_names
            FROM book.added_books ab
            JOIN book.books b ON ab.book_id = b.book_id
            JOIN book.categories c ON b.category_id = c.category_id
            LEFT JOIN book.write_book wb ON wb.book_id = b.book_id
            LEFT JOIN book.authors a ON wb.author_id = a.author_id
            WHERE ab.user_id = $1
            GROUP BY ab.book_id, b.title, b.subtitle, b.published_date, b.description, 
                     b.total_pages, b.language, b.image_links, c.name,
                     ab.buy_date, ab.last_read_date, ab.last_page_read, ab.percent_read,
                     ab.total_read_hours, ab.favorite, ab.last_seen_place, ab.quotation,
                     ab.comment
        `, 
        [userId]
        );
                

        const books = bookResult.rows;

        res.json({
            success: true,
            userData: req.userData,
            bookData: books
        });
  
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
}