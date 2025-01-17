import { Store } from 'redux';
import { GameSettings } from '../../play/server';
import { PropertyCachingState } from '../redux/serviceDispatcher';
import { ReduxState } from '../rootReducer';
import { LobbyActions } from './LobbyActions';
import { lobbySocketService } from './LobbySaga';
import { lobbyService } from './LobbyService';
import { Lobby } from './LobbyTypes';

export class LobbyDispatcher extends lobbyService.dispatcher {
  constructor(
    reduxStore: Store<ReduxState>,
    options?: {
      caching?: PropertyCachingState<void, Lobby>,
      debounce?: number,
    }
  ) {
    super(reduxStore, options);
  }

  public newGame(settings: GameSettings) {
    this.store.dispatch(LobbyActions.newGame(settings));
  }

  public socketConnect() {
    this.store.dispatch(lobbySocketService.actions.join());
  }

  public socketClose() {
    this.store.dispatch(lobbySocketService.actions.close());
  }
}
