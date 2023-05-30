import { EventEmitter } from 'events';
import { Article } from './interfaces';

class ArticlesManager extends EventEmitter {
    articles: Article[] = [];

    payNewArticle(articleId: string, amount: number, userPubKey: string) {
        const article: Article = {
            articleId,
            amount,
            userPubKey,
            hasPaid: false,
        };

        this.articles.push(article);
        return article;
    }

    paidArticlesforUser(articleId: string) {
        let paidArticles;
        this.articles = this.articles.map((article) => {
            if (article.articleId === articleId) {
                paidArticles = { ...article, hasPaid: true };
                return paidArticles;
            }

            return article;
        });

        if (paidArticles) {
            this.emit(paidArticles);
            return paidArticles;
        }

    }
}

export default new ArticlesManager();
