export enum Role {
  Student = 'student',
  Moderator = 'moderator',
  Admin = 'admin',
}

export type User = {
  id: string;
  name: string;
  avatar?: string;
  role: Role;
};

export type Platform = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
};

export type Category = {
  id: string;
  name: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  platformId: string;
  providerName: string;
  isActive: boolean;
  averageRating: number;
  reviewsCount: number;
};

export type CourseCategory = 'popular' | 'programming' | 'design' | 'analytics' | 'other';

export type CoursePreview = {
  id: number;
  title: string;
  platformName: string;
  rating: number;
  reviewsCount: number;
};

export enum ReviewStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Hidden = 'hidden',
}

export type Review = {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  pros: string;
  cons: string;
  createdAt: string;
  status: ReviewStatus;
};

export enum InteractionType {
  View = 'view',
  Like = 'like',
  Bookmark = 'bookmark',
  Rate = 'rate',
}

export type UserInteraction = {
  id: string;
  userId: string;
  courseId: string;
  type: InteractionType;
  createdAt: string;
};

export type UserInterest = {
  id: string;
  userId: string;
  categoryId: string;
  weight: number;
};
