
import type { UserSummary, Post } from '../types';
import type { User as AuthUser } from '../models/User';
import { PostCard } from './PostCard';
import friendsData from '../data/mockFriends.json';

// Types for the mock data
interface MockFriend extends UserSummary {
  bio?: string;
  posts: Post[];
}

interface FriendsPreviewProps {
  currentUser: AuthUser | null;
}

export const FriendsPreview = ({ currentUser }: FriendsPreviewProps) => {
  const friends: MockFriend[] = ((friendsData as any)?.friends) ?? [];

  if (!friends || friends.length === 0) {
    return null;
  }

  return (
    <section className="friends-preview mb-5">
      <h2 className="section-eyebrow mb-3">Amigos</h2>
      <div className="row g-3">
        {friends.map((friend) => (
          <div key={friend.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-2">
                  {friend.name} @{friend.username}
                </h5>
                {friend.bio && <p className="card-text small text-muted">{friend.bio}</p>}
                {friend.posts && friend.posts.length > 0 ? (
                  friend.posts.map((post) => {
                    const postWithUser = {
                      ...post,
                      user: {
                        id: friend.id,
                        name: friend.name,
                        username: friend.username,
                        profileLink: friend.profileLink,
                      },
                    };
                    return (
                      <PostCard
                        key={post.id}
                        post={postWithUser}
                        isOwner={postWithUser.user.id === currentUser?.id}
                        compact={true}
                      />
                    );
                  })
                ) : (
                  <p className="text-muted small">Sem publicações.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
