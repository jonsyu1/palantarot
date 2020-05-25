import _ from "lodash";
import { cardsWithout, compareCards } from "../cardUtils";
import { Card, CompletedTrickTransition, DealtHandTransition, DogRevealTransition, EnteredChatTransition, GameplayState, GameStartTransition, LeftChatTransition, PlayCardAction, PlayerEvent, PlayerId, SetDogAction } from '../common';

export interface PlayState {
  readonly state: GameplayState
  readonly hand: Card[]
  readonly player_order: PlayerId[]
  readonly in_chat: PlayerId[]
  readonly to_play: PlayerId
}

export const blank_state: PlayState = {
  state: "new_game",
  hand: [],
  player_order: [],
  in_chat: [],
  to_play: "",
};

export function updateForEvent(state: PlayState, event: PlayerEvent, player: PlayerId): PlayState {
  switch (event.type) {
    case 'dealt_hand':
      const dealtHand = event as DealtHandTransition;
      return {
        ...state,
        state: "bidding",
        hand: dealtHand.hand,
        player_order: dealtHand.player_order,
      };
    case 'bidding_completed':
      return {
        ...state,
        state: "partner_call",
      };
    case 'dog_revealed':
      const dogRevealed = event as DogRevealTransition;
      if (dogRevealed.player === player) {
        return {
          ...state,
          state: "dog_reveal",
          hand: [...state.hand, ...dogRevealed.dog].sort(compareCards())
        }
      } else {
        return {
          ...state,
          state: "dog_reveal",
        };
      }
    case 'game_started':
      const gameStarted = event as GameStartTransition;
      return {
        ...state,
        state: "playing",
        to_play: gameStarted.first_player,
      };
    case 'game_aborted':
    case 'game_completed':
      return {
        ...state,
        state: "completed",
      };
    case 'play_card':
      const playCard = event as PlayCardAction;
      const to_play = state.player_order[
        (state.player_order.indexOf(playCard.player) + 1) % state.player_order.length]
      if (playCard.player === player) {
        return {
          ...state,
          hand: cardsWithout(state.hand, playCard.card),
          to_play,
        }
      } else {
        return {
          ...state,
          to_play,
        };
      }
    case 'completed_trick':
      const completedTrick = event as CompletedTrickTransition;
      return {
        ...state,
        to_play: completedTrick.winner,
      }
    case 'set_dog':
      const set_dog = event as SetDogAction;
      return {
        ...state,
        hand: cardsWithout(state.hand, ...set_dog.dog),
      };
    case 'entered_chat':
      const enteredChat = event as EnteredChatTransition;
      return {
        ...state,
        in_chat: [...state.in_chat, enteredChat.player],
      };
    case 'left_chat':
      const leftChat = event as LeftChatTransition;
      return {
        ...state,
        in_chat: _.without(state.in_chat, leftChat.player),
      }
    default:
      return state;
  }
}
