export interface ArticleComment {
  _id?: string;
  articleId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  createdAt?: Date;
}