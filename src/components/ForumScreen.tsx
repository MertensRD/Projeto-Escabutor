/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Share2,
  Camera,
  Plus,
  Send,
  Users,
  Sprout,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  ForumPost,
  CommunityGroup,
  ClimateWarning,
  UserProfile
} from '../types';
import { ClimateAlertBanner } from './ClimateAlertBanner';

interface ForumScreenProps {
  posts: ForumPost[];
  communities: CommunityGroup[];
  selectedCommunityId: string;
  onSelectCommunity: (id: string) => void;
  onOpenNewCommunityModal: () => void;
  onOpenPhotoEditor: () => void;
  attachedPhotoUrl?: string;
  onClearAttachedPhoto?: () => void;
  onCreatePost: (postData: {
    communityId: string;
    content: string;
    badgeTag: string;
    imageUrl?: string;
  }) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  warnings: ClimateWarning[];
  onVoteWarning: (warningId: string, type: 'useful' | 'unconfirmed') => void;
  currentUser: UserProfile;
}

const POST_TAGS = [
  '🌱 Dica Agroecológica',
  '🐛 Dúvida com Pragas',
  '🚜 Mutirão & Ajuda Mútua',
  '🌾 Semente Crioula',
  '🌦️ Clima & Solo'
];

export const ForumScreen: React.FC<ForumScreenProps> = ({
  posts,
  communities,
  selectedCommunityId,
  onSelectCommunity,
  onOpenNewCommunityModal,
  onOpenPhotoEditor,
  attachedPhotoUrl,
  onClearAttachedPhoto,
  onCreatePost,
  onLikePost,
  onAddComment,
  warnings,
  onVoteWarning,
  currentUser
}) => {
  const [postContent, setPostContent] = useState('');
  const [selectedTag, setSelectedTag] = useState(POST_TAGS[0]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const filteredPosts =
    selectedCommunityId === 'all'
      ? posts
      : posts.filter((p) => p.communityId === selectedCommunityId);

  const activeCommunity =
    communities.find((c) => c.id === selectedCommunityId) || communities[0];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    onCreatePost({
      communityId: selectedCommunityId === 'all' ? communities[0].id : selectedCommunityId,
      content: postContent.trim(),
      badgeTag: selectedTag,
      imageUrl: attachedPhotoUrl
    });

    setPostContent('');
    if (onClearAttachedPhoto) onClearAttachedPhoto();
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 overflow-y-auto pb-6">
      {/* 1. Climate & Disaster Alert Banner (RF08, RN04) */}
      <div className="pt-3">
        <ClimateAlertBanner warnings={warnings} onVote={onVoteWarning} />
      </div>

      {/* 2. Sub-communities Selector & Create Group (RF07) */}
      <div className="bg-white border-y border-stone-200 px-3 py-2.5 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
            <Users className="h-4 w-4 text-emerald-700" />
            <span>Mural por Comunidade & Cultura (RF07)</span>
          </div>
          <button
            type="button"
            onClick={onOpenNewCommunityModal}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Criar / Ingressar</span>
          </button>
        </div>

        {/* Horizontal Community Group Pills */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
          <button
            type="button"
            onClick={() => onSelectCommunity('all')}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCommunityId === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <span>🌎 Todas as Regiões</span>
          </button>

          {communities.map((grp) => {
            const isSelected = selectedCommunityId === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => onSelectCommunity(grp.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{grp.avatarIcon}</span>
                <span>{grp.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-stone-600'}`}>
                  ({grp.memberCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Post Composer (RF03, RF10) */}
      <div className="mx-3 mb-3 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs">
        <form onSubmit={handlePostSubmit}>
          <div className="flex items-start gap-3 mb-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover border border-emerald-700 shrink-0"
            />
            <div className="flex-1">
              <textarea
                placeholder="Tem uma dúvida rural, dica prática ou sobrou algo no sítio? Compartilhe com os vizinhos..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={2}
                className="w-full resize-none text-xs text-stone-900 placeholder-stone-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Attached Photo Preview if any */}
          {attachedPhotoUrl && (
            <div className="relative mb-2.5 max-h-48 overflow-hidden rounded-xl border border-stone-200">
              <img
                src={attachedPhotoUrl}
                alt="Foto anexada"
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                onClick={onClearAttachedPhoto}
                className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                title="Remover foto"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tag Selector */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-2">
            {POST_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-emerald-100 text-emerald-900 font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-stone-100 pt-2.5">
            <button
              type="button"
              onClick={onOpenPhotoEditor}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
            >
              <Camera className="h-3.5 w-3.5 text-emerald-700" />
              <span>{attachedPhotoUrl ? 'Editar Foto (RF10)' : 'Tirar Foto / Editar'}</span>
            </button>

            <button
              type="submit"
              disabled={!postContent.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              Publicar
            </button>
          </div>
        </form>
      </div>

      {/* 4. Posts Feed */}
      <div className="space-y-3 px-3">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-xs text-stone-500">
            Nenhuma publicação nesta comunidade ainda. Seja o primeiro a compartilhar uma dica ou dúvida!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="h-10 w-10 rounded-full object-cover border border-emerald-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-stone-900">{post.authorName}</h4>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                        {post.distanceKm} km
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      <span>{post.authorLocation}</span>
                      <span className="mx-1 text-stone-300">·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                {post.badgeTag && (
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-700">
                    {post.badgeTag}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <p className="mt-3 text-xs text-stone-800 leading-relaxed">
                {post.content}
              </p>

              {/* Post Image */}
              {post.imageUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                  <img
                    src={post.imageUrl}
                    alt="Foto da publicação"
                    className="max-h-72 w-full object-cover"
                  />
                </div>
              )}

              {/* Post Footer Actions */}
              <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs text-stone-600">
                <button
                  type="button"
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    post.isLiked ? 'text-rose-600 font-semibold' : 'hover:text-stone-900'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{post.likes} Útil</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-stone-900"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments.length} Respostas</span>
                </button>
              </div>

              {/* Comments Thread Accordion */}
              {activeCommentPostId === post.id && (
                <div className="mt-3 space-y-2.5 border-t border-stone-100 pt-3">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 rounded-xl bg-stone-50 p-2.5 text-xs">
                      <img
                        src={c.authorAvatar}
                        alt={c.authorName}
                        className="h-7 w-7 rounded-full object-cover border border-emerald-600 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">{c.authorName}</span>
                          <span className="text-[10px] text-stone-600">{c.createdAt}</span>
                        </div>
                        <p className="mt-1 text-stone-700 leading-normal">{c.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add Reply Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Responder com uma dica ou solução rural..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(post.id);
                      }}
                      className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 focus:border-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCommentSubmit(post.id)}
                      className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
