import _ from "lodash";
import { cardsWithout, compareCards } from "../cardUtils";
import { Bid, BidAction, BiddingCompletedTransition, BidValue, CallPartnerAction, Card, CompletedTrickTransition, DealtHandTransition, DogRevealTransition, EnteredChatTransition, EnterGameAction, GameStartTransition, LeaveGameAction, LeftChatTransition, PlayCardAction, PlayerEvent, PlayerId, PlayerNotReadyAction, PlayerReadyAction, PlayersSetTransition, SetDogAction } from '../common';
import { GameplayState } from '../state';

export interface TrickCards {
  order: string[];
  cards: Map<string, Card>;
  completed: boolean;
  winner?: string;
}

export interface PlayState {
  readonly state: GameplayState;
  readonly hand: Card[];
  readonly playerOrder: PlayerId[];
  readonly readiedPlayers: Set<PlayerId>;
  readonly inChat: PlayerId[];
  readonly toPlay?: PlayerId;
  readonly toBid?: number;
  readonly playerBids: Map<PlayerId, Bid>;
  readonly winningBid?: Bid;
  readonly partnerCard?: Card;
  readonly playedCard?: boolean;
  readonly trick: TrickCards;
}

export const blank_state: PlayState = {
  state: GameplayState.NewGame,
  hand: [],
  playerOrder: [],
  readiedPlayers: new Set(),
  inChat: [],
  playerBids: new Map(),
  trick: {
    order: [],
    cards: new Map(),
    completed: false,
  }
};

function markPlayerReady(state: PlayState, action: PlayerReadyAction): PlayState {
  return {
    ...state,
    readiedPlayers: new Set(state.readiedPlayers).add(action.player),
  };
}

function unmarkPlayerReady(state: PlayState, action: PlayerNotReadyAction): PlayState {
  const newReadiedPlayers = new Set(state.readiedPlayers);
  newReadiedPlayers.delete(action.player);
  return {
    ...state,
    readiedPlayers: newReadiedPlayers,
  };
}

function enterGame(state: PlayState, action: EnterGameAction): PlayState {
  return {
    ...state,
    playerOrder: [...state.playerOrder, action.player],
  };
}

function leaveGame(state: PlayState, action: LeaveGameAction): PlayState {
  return {
    ...state,
    playerOrder: _.without(state.playerOrder, action.player),
  };
}

function dealtHand(state: PlayState, action: DealtHandTransition): PlayState {
  return {
    ...state,
    state: GameplayState.Bidding,
    hand: action.hand,
    playerOrder: action.player_order,
    toBid: 0,
  };
}

function playersSet(state: PlayState, action: PlayersSetTransition): PlayState {
  return {
    ...state,
    state: GameplayState.Bidding,
    playerOrder: action.player_order,
  };
}

function bid(state: PlayState, action: BidAction): PlayState {
  const newBids = new Map(state.playerBids);
  newBids.set(action.player, {
    player: action.player,
    bid: action.bid,
    calls: action.calls ?? [],
  });
  const passCount = [...state.playerBids.values()].reduce((acc, value) => {
    return acc + (value.bid === BidValue.PASS ? 1 : 0);
  }, 0);
  if (state.playerOrder.length - passCount <= 1) {
    return {
      ...state,
      playerBids: newBids,
    };
  }
  let newBidder = state.toBid ?? 0;
  do {
    newBidder = (newBidder + 1) % state.playerOrder.length;
  } while (state.playerBids.get(state.playerOrder[newBidder])?.bid === BidValue.PASS);
  return {
    ...state,
    toBid: newBidder,
    playerBids: newBids,
  };
}

function biddingCompleted(state: PlayState, action: BiddingCompletedTransition): PlayState {
  return {
    ...state,
    state: GameplayState.PartnerCall,
    winningBid: action.winning_bid,
  };
}

function callPartner(state: PlayState, action: CallPartnerAction): PlayState {
  return {
    ...state,
    state: GameplayState.PartnerCall,
    partnerCard: action.card,
  };
}

function dogRevealed(state: PlayState, action: DogRevealTransition, player: PlayerId): PlayState {
  if (action.player === player) {
    return {
      ...state,
      state: GameplayState.DogReveal,
      hand: [...state.hand, ...action.dog].sort(compareCards())
    }
  } else {
    return {
      ...state,
      state: GameplayState.DogReveal,
    };
  }
}

function setDog(state: PlayState, action: SetDogAction): PlayState {
  return {
    ...state,
    hand: cardsWithout(state.hand, ...action.dog),
  };
}

function gameStarted(state: PlayState, action: GameStartTransition): PlayState {
  return {
    ...state,
    state: GameplayState.Playing,
    toPlay: action.first_player,
  };
}

function playCard(state: PlayState, action: PlayCardAction, player: PlayerId) {
  const playerIndex = state.playerOrder.indexOf(action.player) + 1;
  const toPlay = state.playerOrder[playerIndex % state.playerOrder.length];
  let newTrickCards;
  let newOrder;
  if (state.trick.completed) {
    newTrickCards = new Map([[action.player, action.card]]);
    newOrder = [action.player];
  } else {
    newTrickCards = new Map(state.trick.cards);
    newTrickCards.set(action.player, action.card);
    newOrder = [...state.trick.order ?? [], action.player];
  }
  const newTrick: TrickCards = {
    order: newOrder,
    cards: newTrickCards,
    completed: false,
  };
  if (action.player === player) {
    return {
      ...state,
      hand: cardsWithout(state.hand, action.card),
      toPlay,
      playedCard: true,
      trick: newTrick,
    }
  } else {
    return {
      ...state,
      toPlay,
      playedCard: true,
      trick: newTrick,
    };
  }
}

function completedTrick(state: PlayState, action: CompletedTrickTransition): PlayState {
  return {
    ...state,
    trick: { ...state.trick, completed: true, winner: action.winner },
    toPlay: action.winner,
  }
}

export function updateForEvent(state: PlayState, event: PlayerEvent, player: PlayerId): PlayState {
  switch (event.type) {
    case 'mark_player_ready':
      return markPlayerReady(state, event as PlayerReadyAction);
    case 'unmark_player_ready':
      return unmarkPlayerReady(state, event as PlayerNotReadyAction);
    case 'enter_game':
      return enterGame(state, event as EnterGameAction);
    case 'leave_game':
      return leaveGame(state, event as LeaveGameAction);
    case 'dealt_hand':
      return dealtHand(state, event as DealtHandTransition);
    case 'players_set':
      return playersSet(state, event as PlayersSetTransition);
    case 'bid':
      return bid(state, event as BidAction);
    case 'bidding_completed':
      return biddingCompleted(state, event as BiddingCompletedTransition);
    case 'call_partner':
      return callPartner(state, event as CallPartnerAction);
    case 'dog_revealed':
      return dogRevealed(state, event as DogRevealTransition, player);
    case 'set_dog':
      return setDog(state, event as SetDogAction);
    case 'game_started':
      return gameStarted(state, event as GameStartTransition);
    case 'play_card':
      return playCard(state, event as PlayCardAction, player);
    case 'completed_trick':
      return completedTrick(state, event as CompletedTrickTransition);
    case 'game_aborted':
    case 'game_completed':
      return {
        ...state,
        state: GameplayState.Completed,
      };
    case 'entered_chat':
      const enteredChat = event as EnteredChatTransition;
      return {
        ...state,
        inChat: [...state.inChat, enteredChat.player],
      };
    case 'left_chat':
      const leftChat = event as LeftChatTransition;
      return {
        ...state,
        inChat: _.without(state.inChat, leftChat.player),
      }
    default:
      return state;
  }
}
