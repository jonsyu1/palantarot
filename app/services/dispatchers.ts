import { Store } from 'redux';
import { AddNewPlayerDispatcher } from './addPlayer/index';
import { AddTarothonDispatcher } from './addTarothon/index';
import { AuthDispatcher } from './auth/index';
import { BidsDispatcher } from './bids/index';
import { DeleteGameDispatcher } from './deleteGame/index';
import { DeleteTarothonDispatcher } from './deleteTarothon/index';
import { DeltasDispatcher } from './deltas/index';
import { GameDispatcher } from './game/index';
import { GamePlayerDispatcher } from './gamePlayer/GamePlayerDispatcher';
import { InGameDispatcher } from './ingame/InGameDispatcher';
import { LobbyDispatcher } from './lobby/LobbyDispatcher';
import { MonthGamesDispatcher } from './monthGames/index';
import { PageCacheDispatcher } from './pageCache/actions';
import { PlayersDispatcher } from './players/index';
import { RecentGamesDispatcher } from './recentGames/index';
import { RecordsDispatcher } from './records/index';
import { CacheFunction } from './redux/serviceDispatcher';
import { ResultsDispatcher } from './results/index';
import { ReduxState } from './rootReducer';
import { SaveGameDispatcher } from './saveGame/index';
import { SearchDispatcher, searchLoader } from './search/index';
import { StatsDispatcher } from './stats/index';
import { StreaksDispatcher } from './streaks/index';
import { TarothonDataDispatcher } from './tarothonData';
import { TarothonsDispatcher } from './tarothons/index';

export interface Dispatchers {
  addPlayer: AddNewPlayerDispatcher;
  addTarothon: AddTarothonDispatcher;
  auth: AuthDispatcher;
  bids: BidsDispatcher;
  deleteGame: DeleteGameDispatcher;
  deleteTarothon: DeleteTarothonDispatcher;
  deltas: DeltasDispatcher;
  games: GameDispatcher;
  gamePlayer: GamePlayerDispatcher;
  ingame: InGameDispatcher;
  lobby: LobbyDispatcher;
  monthGames: MonthGamesDispatcher;
  pageCache: PageCacheDispatcher;
  players: PlayersDispatcher;
  recentGames: RecentGamesDispatcher;
  records: RecordsDispatcher;
  results: ResultsDispatcher;
  saveGame: SaveGameDispatcher;
  search: SearchDispatcher;
  stats: StatsDispatcher;
  streaks: StreaksDispatcher;
  tarothonData: TarothonDataDispatcher;
  tarothons: TarothonsDispatcher;
}

export const dispatcherCreators = (store: Store<ReduxState>): Dispatchers => {
  return {
    addPlayer: new AddNewPlayerDispatcher(store),
    addTarothon: new AddTarothonDispatcher(store),
    auth: new AuthDispatcher(
      store,
    ),
    bids: new BidsDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.bids,
          isCached: CacheFunction.pageCache(),
        },
      },
    ),
    deleteGame: new DeleteGameDispatcher(store),
    deleteTarothon: new DeleteTarothonDispatcher(store),
    games: new GameDispatcher(
      store,
    ),
    deltas: new DeltasDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.deltas,
          isCached: CacheFunction.pageCache(),
        },
      },
    ),
    gamePlayer: new GamePlayerDispatcher(store),
    ingame: new InGameDispatcher(store),
    lobby: new LobbyDispatcher(store),
    monthGames: new MonthGamesDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.monthGames,
          isCached: CacheFunction.and(CacheFunction.notThisMonth(), CacheFunction.pageCache()),
        },
      },
    ),
    pageCache: new PageCacheDispatcher(store),
    players: new PlayersDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.players,
          isCached: CacheFunction.and(CacheFunction.loading(), CacheFunction.pageCache()),
        },
        debounce: 500,
      },
    ),
    recentGames: new RecentGamesDispatcher(
      store,
    ),
    records: new RecordsDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.records,
          isCached: CacheFunction.pageCache(),
        },
      },
    ),
    results: new ResultsDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.results,
          isCached: CacheFunction.and(CacheFunction.notThisMonth(), CacheFunction.pageCache()),
        }
      }
    ),
    saveGame: new SaveGameDispatcher(
      store,
    ),
    search: new SearchDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.search,
          isCached: CacheFunction.pageCache(),
        },
        argToKey: searchLoader.argToKey,
      }
    ),
    stats: new StatsDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.stats,
          isCached: CacheFunction.pageCache(),
        }
      }
    ),
    streaks: new StreaksDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.streaks,
          isCached: CacheFunction.pageCache(),
        }
      }
    ),
    tarothonData: new TarothonDataDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.tarothonData,
          isCached: CacheFunction.pageCache(),
        }
      }
    ),
    tarothons: new TarothonsDispatcher(
      store,
      {
        caching: {
          accessor: (state: ReduxState) => state.tarothons,
          isCached: CacheFunction.pageCache(),
        }
      }
    ),
  };
};
