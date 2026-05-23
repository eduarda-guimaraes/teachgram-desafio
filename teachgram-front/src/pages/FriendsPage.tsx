import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getImageUrl } from '../utils/ImageUtils';
import type { UserSummary } from '../types';
import mockFriendsData from '../data/mockFriends.json';
import { fetchUsers } from '../services/userService';

const PAGE_SIZE = 4;

export const FriendsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFriend, setNewFriend] = useState<Partial<UserSummary>>({
    name: '',
    username: '',
    profileLink: '',
    bio: ''
  });

  const [allUsers, setAllUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const availableUsers = useMemo(
    () => allUsers.filter((u) => !friends.some((f) => f.id === u.id)),
    [allUsers, friends]
  );

  useEffect(() => {
    const stored = localStorage.getItem('friendsData');
    const initialFriends = stored ? JSON.parse(stored) : (mockFriendsData as any).friends || [];
    setFriends(initialFriends);
    const mockAll = (mockFriendsData as any).friends || [];
    setAllUsers(mockAll);
    fetchUsers()
      .then((users) => setAllUsers(users))
      .catch(() => {
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriend.name?.trim() || !newFriend.username?.trim()) return;
    if (friends.some((f) => f.username === newFriend.username?.trim())) return;
    const friend: UserSummary = {
      id: Date.now(),
      name: newFriend.name.trim(),
      username: newFriend.username.trim(),
      profileLink: newFriend.profileLink?.trim() || '',
      bio: newFriend.bio?.trim() || ''
    };
    const updatedFriends = [friend, ...friends];
    setFriends(updatedFriends);
    setAllUsers((prev) => [friend, ...prev]);
    localStorage.setItem('friendsData', JSON.stringify(updatedFriends));
    setNewFriend({ name: '', username: '', profileLink: '', bio: '' });
    setShowAddForm(false);
  };

  const handleAddExistingFriend = () => {
    if (selectedUserId === null) return;
    const user = allUsers.find((u) => u.id === selectedUserId);
    if (!user) return;
    if (friends.some((f) => f.id === user.id)) return;
    const friend: UserSummary = {
      id: user.id,
      name: user.name,
      username: user.username,
      profileLink: user.profileLink,
      bio: user.bio
    };
    const updatedFriends = [friend, ...friends];
    setFriends(updatedFriends);
    localStorage.setItem('friendsData', JSON.stringify(updatedFriends));
    setSelectedUserId(null);
  };

  const filteredFriends = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return friends;
    return friends.filter((friend) =>
      [friend.name, friend.username, friend.bio ?? ''].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [friends, search]);

  const totalPages = Math.max(1, Math.ceil(filteredFriends.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageFriends = filteredFriends.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="friends-page">
      <div className="friends-page__backdrop" />

      <section className="friends-page__modal">
        <header className="friends-page__header">
          <h2>Amigos ({friends.length})</h2>
          <Link to="/feed" className="friends-page__close" aria-label="Fechar">
            x
          </Link>
        </header>

        {/* Add‑friend button & form */}
        <button
          type="button"
          className="primary-button me-2"
          onClick={() => setShowAddForm(true)}
        >
          Adicionar amigo
        </button>
        {showAddForm && (
          <form className="add-friend-form" onSubmit={handleAddFriend} style={{ marginTop: '1rem' }}>
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={newFriend.name || ''}
                onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Usuário</label>
              <input
                type="text"
                value={newFriend.username || ''}
                onChange={(e) => setNewFriend({ ...newFriend, username: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Link da foto (opcional)</label>
              <input
                type="text"
                value={newFriend.profileLink || ''}
                onChange={(e) => setNewFriend({ ...newFriend, profileLink: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Bio (opcional)</label>
              <textarea
                value={newFriend.bio || ''}
                onChange={(e) => setNewFriend({ ...newFriend, bio: e.target.value })}
              />
            </div>
            <button type="submit" className="primary-button">
              Salvar
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowAddForm(false)}
              style={{ marginLeft: '0.5rem' }}
            >
              Cancelar
            </button>
          </form>
        )}

        {availableUsers.length > 0 && (
          <div className="add-existing-friend" style={{ marginTop: '1rem' }}>
            <select
              className="styled-select"
              value={selectedUserId ?? ''}
              onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Selecione um usuário</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (@{u.username})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="primary-button"
              onClick={handleAddExistingFriend}
              disabled={selectedUserId === null}
              style={{ marginLeft: '0.5rem' }}
            >
              Adicionar selecionado
            </button>
          </div>
        )}

        <div className="friends-page__search-wrapper mb-3">
          <div className="inline-search w-100">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar amigos"
              aria-label="Buscar amigos"
            />
          </div>
        </div>

        <div className="friends-page__list">
          {loading ? (
            <div className="empty-state">
              <h3>Carregando amigos</h3>
              <p>Estamos buscando sua rede agora.</p>
            </div>
          ) : pageFriends.length > 0 ? (
            pageFriends.map((friend) => (
              <article key={friend.id} className="friend-row">
                <div
                  className="friend-row__avatar"
                  style={friend.profileLink ? {
                    backgroundImage: `url(${getImageUrl(friend.profileLink)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'transparent'
                  } : undefined}
                >
                  {friend.name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join('')}
                </div>
                <div className="friend-row__content">
                  <strong>{friend.name}</strong>
                  <p>@{friend.username}</p>
                </div>
                <Link to={`/perfil/${friend.id}`} className="friend-row__button">
                  Ver perfil
                </Link>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <h3>Nenhum amigo encontrado</h3>
              <p>Quando você adicionar conexões, elas aparecem aqui.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <footer className="friends-page__pagination mt-3">
          <nav aria-label="Paginação de amigos">
            <ul className="pagination pagination-sm justify-content-center m-0">
              <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  aria-label="Anterior"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  ←
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
                <li key={item} className="page-item">
                  <button
                    type="button"
                    className={`page-link ${item === safePage ? 'active' : ''}`}
                    aria-current={item === safePage ? 'page' : undefined}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  aria-label="Próxima"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  →
                </button>
              </li>
            </ul>
          </nav>
        </footer>
      </section>
    </div>
  );
};
