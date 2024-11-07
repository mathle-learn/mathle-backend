import express from 'express';
import { Request, Response } from 'express';
import { queryToDB } from '../../db/connection';
import { toTitleCase } from '../utils';

const subjectRouter = express.Router();

subjectRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) res.status(400).json({ error: 'Missing ID' });

        const query = `SELECT ID_Article, ID_Prev_Article, title FROM Article WHERE ID_Parent = ?`;
        const articles = await queryToDB(query, [id]);
        if (articles.length === 0) res.status(404).json({ error: 'No articles found' });
        const articles2Send = articles.map((article) => ({
            ...article,
            title: toTitleCase(article.title),
        }));
        else res.status(200).json( articles2Send );
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Error fetching articles' });
    }
});

export default subjectRouter;
