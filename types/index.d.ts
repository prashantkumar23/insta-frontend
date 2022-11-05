export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type AddCommentInput = {
  blogId: Scalars['String'];
  commentBody: Scalars['String'];
  userId: Scalars['String'];
};

export type AddCommentResponse = {
  __typename?: 'AddCommentResponse';
  comment?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  status: Scalars['Boolean'];
};

export type Blog = {
  __typename?: 'Blog';
  _id: Scalars['String'];
  blogImageUrl: Scalars['String'];
  body: Scalars['String'];
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  user: UserCreated;
};

export type BlogByTag = {
  __typename?: 'BlogByTag';
  _id: Scalars['String'];
  blogImageUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  tags?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  user?: Maybe<UserInfoTwo>;
};

export type BlogComment = {
  __typename?: 'BlogComment';
  _id: Scalars['String'];
  comment: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  user: CommentedUserOnThatBlog;
};

export type BlogComments = {
  __typename?: 'BlogComments';
  _id: Scalars['String'];
  comments?: Maybe<Array<BlogComment>>;
};

export type Blogs = {
  __typename?: 'Blogs';
  _id: Scalars['String'];
  blogImageUrl: Scalars['String'];
  createdAt: Scalars['DateTime'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  user: UserInfo;
};

export type BlogsArray = {
  __typename?: 'BlogsArray';
  blogImageUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  comment: Scalars['String'];
  id: Scalars['String'];
};

export type CommentedUserOnThatBlog = {
  __typename?: 'CommentedUserOnThatBlog';
  _id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type CreateBlogInput = {
  blogImageUrl: Scalars['String'];
  body: Scalars['String'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  userId: Scalars['String'];
};

export type CreateBlogResponse = {
  __typename?: 'CreateBlogResponse';
  message: Scalars['String'];
  status: Scalars['Boolean'];
};

export type DashboardResponse = {
  __typename?: 'DashboardResponse';
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Boolean']>;
};

export type DeleteCommentInput = {
  blogId: Scalars['String'];
  commentId: Scalars['String'];
};

export type DeleteCommentResponse = {
  __typename?: 'DeleteCommentResponse';
  message: Scalars['String'];
  status: Scalars['Boolean'];
};

export type GetAllTopicsResponse = {
  __typename?: 'GetAllTopicsResponse';
  message: Scalars['String'];
  topics: Array<Topic>;
};

export type GetBlogInput = {
  blogId: Scalars['String'];
};

export type GetBlogResponse = {
  __typename?: 'GetBlogResponse';
  blog?: Maybe<Blog>;
  message?: Maybe<Scalars['String']>;
};

export type GetBlogsByTagInput = {
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
  tag: Scalars['String'];
};

export type GetBlogsByTagResponse = {
  __typename?: 'GetBlogsByTagResponse';
  blogs?: Maybe<Array<BlogByTag>>;
  count: Scalars['Float'];
  message: Scalars['String'];
  next?: Maybe<NextTopicParams>;
  prevoius?: Maybe<Scalars['String']>;
};

export type GetBlogsInput = {
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type GetBlogsResponse = {
  __typename?: 'GetBlogsResponse';
  blogs?: Maybe<Array<Blogs>>;
  count: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  next?: Maybe<NextBlogsParams>;
  prevoius?: Maybe<Scalars['String']>;
};

export type GetCommentsOfBlogInput = {
  blogId: Scalars['String'];
};

export type GetCommentsOfBlogResponse = {
  __typename?: 'GetCommentsOfBlogResponse';
  blogComments?: Maybe<BlogComments>;
  count?: Maybe<Scalars['Float']>;
  message?: Maybe<Scalars['String']>;
  next?: Maybe<NextCommentsParams>;
  prevoius?: Maybe<Scalars['String']>;
};

export type GetListOfUsersResponse = {
  __typename?: 'GetListOfUsersResponse';
  message: Scalars['String'];
  users?: Maybe<Array<ListOfUsers>>;
};

export type GetTopBlogsByTopicInput = {
  topic: Scalars['String'];
};

export type GetTopBlogsByTopicResponse = {
  __typename?: 'GetTopBlogsByTopicResponse';
  blogs?: Maybe<Array<TopBlogs>>;
  message?: Maybe<Scalars['String']>;
};

export type GetTopTagsByNumberOfPostResponse = {
  __typename?: 'GetTopTagsByNumberOfPostResponse';
  tag?: Maybe<Scalars['String']>;
};

export type GetUserBlogInput = {
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
  userId: Scalars['String'];
};

export type GetUserBlogsFromOtherUsersInput = {
  nPerPage: Scalars['Float'];
  name: Scalars['String'];
  pageNumber: Scalars['Float'];
};

export type GetUserBlogsFromOtherUsersResponse = {
  __typename?: 'GetUserBlogsFromOtherUsersResponse';
  blogs?: Maybe<Array<UserBlogsArray>>;
  count: Scalars['Float'];
  message: Scalars['String'];
  next?: Maybe<NextUserBlogsParams2>;
  prevoius?: Maybe<Scalars['String']>;
};

export type GetUserBlogsResponse = {
  __typename?: 'GetUserBlogsResponse';
  blogs?: Maybe<Array<BlogsArray>>;
  count: Scalars['Float'];
  message: Scalars['String'];
  next?: Maybe<NextUserBlogsParams>;
  prevoius?: Maybe<Scalars['String']>;
};

export type GetUserInfoFromNameInput = {
  name: Scalars['String'];
};

export type GetUserInfoFromNameResponse = {
  __typename?: 'GetUserInfoFromNameResponse';
  message: Scalars['String'];
  user?: Maybe<UserInformation3>;
};

export type GetUserInfoInput = {
  userId: Scalars['String'];
};

export type GetUserInfoResponse = {
  __typename?: 'GetUserInfoResponse';
  message: Scalars['String'];
  user?: Maybe<UserInformation>;
};

export type ImageUploadInput = {
  photo: Scalars['String'];
  username: Scalars['String'];
};

export type ImageUploadResponse = {
  __typename?: 'ImageUploadResponse';
  message: Scalars['String'];
  status: Scalars['Boolean'];
  url: Scalars['String'];
};

export type ListOfUsers = {
  __typename?: 'ListOfUsers';
  id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: AddCommentResponse;
  createBlog: CreateBlogResponse;
  deleteComment: DeleteCommentResponse;
  imageUpload: ImageUploadResponse;
  updateBio?: Maybe<UpdateBioResponse>;
  updateComment: UpdateCommentResponse;
};


export type MutationAddCommentArgs = {
  addCommentInput: AddCommentInput;
};


export type MutationCreateBlogArgs = {
  createBlogInput: CreateBlogInput;
};


export type MutationDeleteCommentArgs = {
  updateCommentInput: DeleteCommentInput;
};


export type MutationImageUploadArgs = {
  imageUploadInput: ImageUploadInput;
};


export type MutationUpdateBioArgs = {
  updateBioInput: UpdateBioInput;
};


export type MutationUpdateCommentArgs = {
  updateCommentInput: UpdateCommentInput;
};

export type NextBlogsParams = {
  __typename?: 'NextBlogsParams';
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type NextCommentsParams = {
  __typename?: 'NextCommentsParams';
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type NextTopicParams = {
  __typename?: 'NextTopicParams';
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type NextUserBlogsParams = {
  __typename?: 'NextUserBlogsParams';
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type NextUserBlogsParams2 = {
  __typename?: 'NextUserBlogsParams2';
  nPerPage: Scalars['Float'];
  pageNumber: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  dashboard: DashboardResponse;
  getAllTopics: GetAllTopicsResponse;
  getBlog: GetBlogResponse;
  getBlogs: GetBlogsResponse;
  getBlogsByTag: GetBlogsByTagResponse;
  getCommentsOfBlog: GetCommentsOfBlogResponse;
  getListOfUsers?: Maybe<GetListOfUsersResponse>;
  getTopBlogsByTopicResolver: GetTopBlogsByTopicResponse;
  getTopTagsByNumberOfPost: Array<GetTopTagsByNumberOfPostResponse>;
  getUserBlogs?: Maybe<GetUserBlogsResponse>;
  getUserBlogsFromOtherUsers?: Maybe<GetUserBlogsFromOtherUsersResponse>;
  getUserInfo?: Maybe<GetUserInfoResponse>;
  getUserInfoFromName?: Maybe<GetUserInfoFromNameResponse>;
  search: SearchResponse;
};


export type QueryGetBlogArgs = {
  blogId: GetBlogInput;
};


export type QueryGetBlogsArgs = {
  getBlogsInput: GetBlogsInput;
};


export type QueryGetBlogsByTagArgs = {
  findByTagInput: GetBlogsByTagInput;
};


export type QueryGetCommentsOfBlogArgs = {
  blogId: GetCommentsOfBlogInput;
};


export type QueryGetTopBlogsByTopicResolverArgs = {
  getTopBlogsByTopicInput: GetTopBlogsByTopicInput;
};


export type QueryGetUserBlogsArgs = {
  userId: GetUserBlogInput;
};


export type QueryGetUserBlogsFromOtherUsersArgs = {
  getUserBlogsFromOtherUsersInput: GetUserBlogsFromOtherUsersInput;
};


export type QueryGetUserInfoArgs = {
  userId: GetUserInfoInput;
};


export type QueryGetUserInfoFromNameArgs = {
  name: GetUserInfoFromNameInput;
};


export type QuerySearchArgs = {
  createBlogInput: SearchInput;
};

export type SearchInput = {
  term: Scalars['String'];
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  message: Scalars['String'];
  result?: Maybe<Array<SearchResult>>;
  status: Scalars['Boolean'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  _id: Scalars['String'];
  title: Scalars['String'];
};

export type TopBlogs = {
  __typename?: 'TopBlogs';
  _id: Scalars['String'];
  blogImageUrl: Scalars['String'];
  createdAt: Scalars['DateTime'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  user: UserAssociated;
};

export type Topic = {
  __typename?: 'Topic';
  topicColorCode: Scalars['String'];
  topicDescription: Scalars['String'];
  topicName: Scalars['String'];
};

export type UpdateBioInput = {
  bio: Scalars['String'];
  userId: Scalars['String'];
};

export type UpdateBioResponse = {
  __typename?: 'UpdateBioResponse';
  bio?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type UpdateCommentInput = {
  commentBody: Scalars['String'];
  commentId: Scalars['String'];
};

export type UpdateCommentResponse = {
  __typename?: 'UpdateCommentResponse';
  comment?: Maybe<Comment>;
  message: Scalars['String'];
  status: Scalars['Boolean'];
};

export type UserAssociated = {
  __typename?: 'UserAssociated';
  _id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type UserBlogsArray = {
  __typename?: 'UserBlogsArray';
  blogImageUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
  user: UserInformation2;
};

export type UserCreated = {
  __typename?: 'UserCreated';
  _id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  _id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type UserInfoTwo = {
  __typename?: 'UserInfoTwo';
  _id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type UserInformation = {
  __typename?: 'UserInformation';
  bio?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type UserInformation2 = {
  __typename?: 'UserInformation2';
  bio: Scalars['String'];
  id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};

export type UserInformation3 = {
  __typename?: 'UserInformation3';
  bio?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image: Scalars['String'];
  name: Scalars['String'];
};
