import { EventEmitter } from 'events';
import { Article } from './interfaces';

class ArticlesManager extends EventEmitter {
    articles: Article[] = [];

    payNewArticle(articleId: number, amount: number, userPubKey: string) {
        const article: Article = {
            articleId,
            amount,
            userPubKey,
            hasPaid: false,
        };

        this.articles.push(article);
        return article;
    }

    paidArticlesforUser(userPubKey: string) {
        return this.articles.filter((article) => article.userPubKey === userPubKey && article.hasPaid === true);
    }
}

export default new ArticlesManager();
