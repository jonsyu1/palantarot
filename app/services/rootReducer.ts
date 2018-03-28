import { ReduxState } from './rootReducer';
import { playersReducer, PlayersService } from './players';
import { recentGamesReducer, RecentGamesService } from './recentGames';
import { gameReducer, GameService } from './game';
import { resultsReducer, ResultsService } from './results';
import { AddPlayerService, addPlayerReducer } from './addPlayer/index';
import { MonthGamesService, monthGamesReducer } from './monthGames/index';
import { SaveGameService, saveGameReducer } from './saveGame/index';
import { DeleteGameService, deleteGameReducer } from './deleteGame/index';
import { AuthService, authReducer } from './auth/index';
import { RecordsService, recordsReducer } from './records/index';
import { statsReducer, StatsService } from './stats/index';
import { DeltasService, deltasReducer } from './deltas/index';
import { combineReducers } from 'redux';

export interface ReduxState {
  addPlayer: AddPlayerService;
  auth: AuthService;
  deleteGame: DeleteGameService;
  deltas: DeltasService;
  games: GameService;
  monthGames: MonthGamesService;
  players: PlayersService;
  recentGames: RecentGamesService;
  records: RecordsService;
  results: ResultsService;
  saveGame: SaveGameService;
  stats: StatsService;
}

export const rootReducer = combineReducers({
  addPlayer: addPlayerReducer,
  auth: authReducer,
  deleteGame: deleteGameReducer,
  deltas: deltasReducer,
  games: gameReducer,
  monthGames: monthGamesReducer,
  players: playersReducer,
  recentGames: recentGamesReducer,
  records: recordsReducer,
  results: resultsReducer,
  saveGame: saveGameReducer,
  stats: statsReducer,
});