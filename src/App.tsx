/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserProfile,
  BarterItem,
  ClimateWarning,
  CommunityGroup,
  ForumPost,
  Conversation,
  NeighborReview,
  AppTab
} from './types';
import {
  initialCurrentUser,
  initialBarterItems,
  initialClimateWarnings,
  initialCommunityGroups,
  initialForumPosts,
  initialConversations,
  initialReviews
} from './data/seedData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ForumScreen } from './components/ForumScreen';
import { EscamboScreen } from './components/EscamboScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { BarterProposalModal } from './components/BarterProposalModal';
import { NewBarterItemModal } from './components/NewBarterItemModal';
import { NewCommunityModal } from './components/NewCommunityModal';
import { NeighborReviewModal } from './components/NeighborReviewModal';

export default function App() {
  // Authentication State (RN01)
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Layout View Mode (Mobile frame vs Expanded)
  const [isSmartphoneFramed, setIsSmartphoneFramed] = useState(true);

  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState<AppTab>('forum');

  // Core Data States
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialCurrentUser);
  const [barterItems, setBarterItems] = useState<BarterItem[]>(initialBarterItems);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(initialForumPosts);
  const [communities, setCommunities] = useState<CommunityGroup[]>(initialCommunityGroups);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('all');
  const [climateWarnings, setClimateWarnings] = useState<ClimateWarning[]>(initialClimateWarnings);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<NeighborReview[]>(initialReviews);

  // Modals & In-App Photo Editor State (RF10)
  const [isPhotoEditorOpen, setIsPhotoEditorOpen] = useState(false);
  const [photoEditorTarget, setPhotoEditorTarget] = useState<'post' | 'item' | 'profile'>('post');
  const [attachedPostPhoto, setAttachedPostPhoto] = useState<string | undefined>(undefined);
  const [lastEditedItemPhoto, setLastEditedItemPhoto] = useState<string | undefined>(undefined);

  // Proposal Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalTargetItem, setProposalTargetItem] = useState<BarterItem | null>(null);

  // Other Modals State
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isNewCommunityModalOpen, setIsNewCommunityModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    neighborName: string;
    neighborAvatar: string;
    tradeSummary: string;
  } | null>(null);

  // --- Handlers ---

  // Forum Handlers
  const handleLikePost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `comm_${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorAvatar: currentUser.avatarUrl,
            authorLocation: currentUser.farmName,
            content: commentText,
            createdAt: 'Agora mesmo',
            likes: 0
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (postData: {
    communityId: string;
    content: string;
    badgeTag: string;
    imageUrl?: string;
  }) => {
    const targetComm = communities.find((c) => c.id === postData.communityId) || communities[0];
    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      communityId: targetComm.id,
      communityName: targetComm.name,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorLocation: currentUser.farmName,
      distanceKm: 0,
      content: postData.content,
      badgeTag: postData.badgeTag,
      imageUrl: postData.imageUrl,
      createdAt: 'Agora mesmo',
      likes: 1,
      isLiked: true,
      comments: []
    };
    setForumPosts((prev) => [newPost, ...prev]);
  };

  // Escambo Handlers
  const handleSaveNewItem = (
    itemData: Omit<
      BarterItem,
      'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userAvatar' | 'userLocation' | 'distanceKm'
    >
  ) => {
    const newItem: BarterItem = {
      ...itemData,
      id: `item_${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.name} (Você)`,
      userAvatar: currentUser.avatarUrl,
      userLocation: currentUser.farmName,
      distanceKm: 0,
      createdAt: 'Hoje',
      status: 'disponivel'
    };
    setBarterItems((prev) => [newItem, ...prev]);
    setLastEditedItemPhoto(undefined);
  };

  const handleDeleteItem = (itemId: string) => {
    setBarterItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleOpenProposal = (item: BarterItem) => {
    setProposalTargetItem(item);
    setIsProposalModalOpen(true);
  };

  const handleSubmitProposal = (data: {
    targetItem: BarterItem;
    offeredTitle: string;
    offeredDescription: string;
    offeredItemId?: string;
    offeredImage?: string;
  }) => {
    const targetItem = data.targetItem;

    // Check if conversation with this neighbor exists, or create one
    let targetConv = conversations.find((c) => c.participantId === targetItem.userId);

    const proposalId = `prop_${Date.now()}`;
    const newProposal = {
      id: proposalId,
      conversationId: targetConv ? targetConv.id : `conv_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: targetItem.userId,
      requestedItemId: targetItem.id,
      requestedItemTitle: targetItem.title,
      requestedItemImage: targetItem.imageUrl,
      offeredItemTitle: data.offeredTitle,
      offeredItemDescription: data.offeredDescription,
      offeredItemImage: data.offeredImage,
      status: 'pendente' as const,
      createdAt: 'Agora mesmo'
    };

    const newChatMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: `Olá ${targetItem.userName}! Enviei uma proposta de escambo pelo seu item "${targetItem.title}". Ofereço em troca: ${data.offeredTitle}.`,
      timestamp: 'Agora mesmo',
      isProposal: true,
      proposalId
    };

    if (targetConv) {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConv!.id) {
            return {
              ...c,
              activeProposal: newProposal,
              lastMessage: `Proposta de escambo enviada: ${data.offeredTitle}`,
              lastTimestamp: 'Agora',
              messages: [...c.messages, newChatMessage]
            };
          }
          return c;
        })
      );
      setActiveConversationId(targetConv.id);
    } else {
      const newConv: Conversation = {
        id: newProposal.conversationId,
        participantId: targetItem.userId,
        participantName: targetItem.userName,
        participantAvatar: targetItem.userAvatar,
        participantLocation: targetItem.userLocation,
        distanceKm: targetItem.distanceKm,
        lastMessage: `Proposta de escambo enviada: ${data.offeredTitle}`,
        lastTimestamp: 'Agora',
        unreadCount: 0,
        activeProposal: newProposal,
        messages: [newChatMessage]
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    }

    // Switch to Chat tab to see conversation immediately
    setCurrentTab('chat');
  };

  // Chat Handlers
  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const newMsg = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...conv,
            lastMessage: text,
            lastTimestamp: newMsg.timestamp,
            messages: [...conv.messages, newMsg]
          };
        }
        return conv;
      })
    );
  };

  const handleUpdateProposalStatus = (
    proposalId: string,
    newStatus: 'pendente' | 'aceita' | 'recusada' | 'concluida' | 'cancelada'
  ) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.activeProposal && c.activeProposal.id === proposalId) {
          const updatedProposal = {
            ...c.activeProposal,
            status: newStatus,
            completedAt: newStatus === 'concluida' ? 'Hoje' : undefined
          };
          const systemMsg = {
            id: `sys_${Date.now()}`,
            senderId: 'system',
            text: `[Atualização de Escambo]: A proposta foi marcada como ${newStatus.toUpperCase()}.`,
            timestamp: 'Agora'
          };
          return {
            ...c,
            activeProposal: updatedProposal,
            messages: [...c.messages, systemMsg]
          };
        }
        return c;
      })
    );
  };

  // Climate Warning Feedback (RN04)
  const handleVoteWarning = (warningId: string, type: 'useful' | 'unconfirmed') => {
    setClimateWarnings((prev) =>
      prev.map((w) => {
        if (w.id === warningId) {
          const wasUseful = w.userVoted === 'useful';
          const wasUnconfirmed = w.userVoted === 'unconfirmed';

          let usefulVotes = w.usefulVotes;
          let unconfirmedVotes = w.unconfirmedVotes;

          if (type === 'useful') {
            usefulVotes = wasUseful ? usefulVotes - 1 : usefulVotes + 1;
            if (wasUnconfirmed) unconfirmedVotes = Math.max(0, unconfirmedVotes - 1);
          } else {
            unconfirmedVotes = wasUnconfirmed ? unconfirmedVotes - 1 : unconfirmedVotes + 1;
            if (wasUseful) usefulVotes = Math.max(0, usefulVotes - 1);
          }

          return {
            ...w,
            usefulVotes,
            unconfirmedVotes,
            userVoted: w.userVoted === type ? undefined : type
          };
        }
        return w;
      })
    );
  };

  // Sub-Community Handlers (RF07)
  const handleSaveNewCommunity = (
    commData: Omit<CommunityGroup, 'id' | 'memberCount' | 'isMember'>
  ) => {
    const newGroup: CommunityGroup = {
      ...commData,
      id: `grp_${Date.now()}`,
      memberCount: 1,
      isMember: true
    };
    setCommunities((prev) => [...prev, newGroup]);
    setSelectedCommunityId(newGroup.id);
  };

  // Review & Reputation Handlers (RF06)
  const handleOpenReview = (
    neighborName: string,
    neighborAvatar: string,
    tradeSummary: string
  ) => {
    setReviewTarget({ neighborName, neighborAvatar, tradeSummary });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (
    reviewData: Omit<
      NeighborReview,
      'id' | 'date' | 'authorId' | 'authorName' | 'authorAvatar' | 'targetUserId'
    >
  ) => {
    const newRev: NeighborReview = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      targetUserId: 'neighbor',
      date: 'Hoje'
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Profile Update & Delete Account (RN03)
  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleDeleteAccount = () => {
    // RN03: Permanent deletion & LGPD reset
    setIsLoggedIn(false);
    setCurrentUser(initialCurrentUser);
    setBarterItems(initialBarterItems.filter((i) => i.userId !== initialCurrentUser.id));
    setForumPosts(initialForumPosts.filter((p) => p.authorId !== initialCurrentUser.id));
    setConversations([]);
  };

  // Photo Editor Trigger (RF10)
  const handleOpenPhotoEditorFor = (target: 'post' | 'item' | 'profile') => {
    setPhotoEditorTarget(target);
    setIsPhotoEditorOpen(true);
  };

  const handleSavePhotoFromEditor = (photoUrl: string) => {
    if (photoEditorTarget === 'post') {
      setAttachedPostPhoto(photoUrl);
    } else if (photoEditorTarget === 'item') {
      setLastEditedItemPhoto(photoUrl);
      setIsNewItemModalOpen(true);
    } else if (photoEditorTarget === 'profile') {
      setCurrentUser((prev) => ({ ...prev, avatarUrl: photoUrl }));
    }
  };

  // Not logged in view
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => setIsLoggedIn(true)}
        onRegister={(newUser) => {
          setCurrentUser((prev) => ({ ...prev, ...newUser }));
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const unreadMessagesTotal = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="h-[100dvh] w-full bg-stone-950 sm:bg-stone-900 text-stone-900 flex justify-center items-center sm:py-6 selection:bg-emerald-200 overflow-hidden">
      {/* Smartphone Frame or Full Responsive Wrapper */}
      <div
        className={`w-full bg-white transition-all overflow-hidden flex flex-col relative h-[100dvh] ${
          isSmartphoneFramed
            ? 'max-w-none sm:max-w-[430px] sm:h-[880px] sm:rounded-[36px] sm:border-8 sm:border-stone-800 sm:shadow-2xl'
            : 'max-w-4xl sm:h-[92vh] sm:rounded-2xl sm:shadow-xl'
        }`}
      >
        {/* Smartphone Speaker Ear Piece / Island Notch indicator */}
        {isSmartphoneFramed && (
          <div className="hidden sm:flex justify-center pt-2 pb-1 bg-emerald-800 shrink-0">
            <div className="h-4 w-28 bg-stone-900/60 rounded-full" />
          </div>
        )}

        {/* Global Header */}
        <Header
          currentTab={currentTab}
          isSmartphoneFramed={isSmartphoneFramed}
          onToggleFrame={() => setIsSmartphoneFramed(!isSmartphoneFramed)}
          unreadMessagesCount={unreadMessagesTotal}
          activeAlertsCount={climateWarnings.length}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            if (tab === 'chat') setActiveConversationId(null);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
          {currentTab === 'forum' && (
            <ForumScreen
              posts={forumPosts}
              communities={communities}
              selectedCommunityId={selectedCommunityId}
              onSelectCommunity={setSelectedCommunityId}
              onOpenNewCommunityModal={() => setIsNewCommunityModalOpen(true)}
              onOpenPhotoEditor={() => handleOpenPhotoEditorFor('post')}
              attachedPhotoUrl={attachedPostPhoto}
              onClearAttachedPhoto={() => setAttachedPostPhoto(undefined)}
              onCreatePost={handleCreatePost}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              warnings={climateWarnings}
              onVoteWarning={handleVoteWarning}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'escambo' && (
            <EscamboScreen
              items={barterItems}
              currentUser={currentUser}
              onOpenNewItemModal={() => setIsNewItemModalOpen(true)}
              onOpenProposalModal={handleOpenProposal}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {currentTab === 'chat' && (
            <ChatScreen
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onSendMessage={handleSendMessage}
              onUpdateProposalStatus={handleUpdateProposalStatus}
              onRequestReview={(name, avatar, summary) =>
                handleOpenReview(name, avatar, summary)
              }
              currentUser={currentUser}
            />
          )}

          {currentTab === 'perfil' && (
            <ProfileScreen
              currentUser={currentUser}
              reviews={reviews}
              userItems={barterItems.filter((i) => i.userId === currentUser.id)}
              onUpdateUser={handleUpdateUser}
              onDeleteAccount={handleDeleteAccount}
              onOpenPhotoEditor={() => handleOpenPhotoEditorFor('profile')}
              onLogout={() => setIsLoggedIn(false)}
            />
          )}
        </main>

        {/* Bottom Tab Bar */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            if (tab === 'chat') setActiveConversationId(null);
          }}
          unreadCount={unreadMessagesTotal}
        />
      </div>

      {/* --- Modals Overlay Layer --- */}

      {/* 1. Photo & Video Studio Editor (RF10) */}
      <PhotoEditorModal
        isOpen={isPhotoEditorOpen}
        onClose={() => setIsPhotoEditorOpen(false)}
        onSavePhoto={handleSavePhotoFromEditor}
        initialPhotoUrl={attachedPostPhoto || lastEditedItemPhoto}
      />

      {/* 2. Barter Proposal Builder (RF02, RF04, RN05) */}
      <BarterProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => {
          setIsProposalModalOpen(false);
          setProposalTargetItem(null);
        }}
        targetItem={proposalTargetItem}
        currentUser={currentUser}
        userAvailableItems={barterItems.filter((i) => i.userId === currentUser.id)}
        onSubmitProposal={handleSubmitProposal}
      />

      {/* 3. New Barter Item Register (RF02) */}
      <NewBarterItemModal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onOpenPhotoEditor={() => handleOpenPhotoEditorFor('item')}
        currentEditedPhoto={lastEditedItemPhoto}
        onSaveItem={handleSaveNewItem}
      />

      {/* 4. New Sub-Community Modal (RF07) */}
      <NewCommunityModal
        isOpen={isNewCommunityModalOpen}
        onClose={() => setIsNewCommunityModalOpen(false)}
        onSaveCommunity={handleSaveNewCommunity}
      />

      {/* 5. Neighbor Review Modal (RF06) */}
      {reviewTarget && (
        <NeighborReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setReviewTarget(null);
          }}
          targetNeighborName={reviewTarget.neighborName}
          targetNeighborAvatar={reviewTarget.neighborAvatar}
          tradeSummary={reviewTarget.tradeSummary}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
}
