import * as React from 'react';
import { Player } from '../../../../server/model/Player';
import { InGameState } from '../../../services/ingame/InGameTypes';
import './BottomLeftStatus.scss';
import { getCardUrl } from './CardSvg';

interface Props {
  width: number;
  height: number;
  players: Map<string, Player>;
  game: InGameState;
}

export class BottomLeftStatus extends React.PureComponent<Props> {
  public render() {
    const { height, game } = this.props;
    const partnerCall = game.state.partnerCard;
    const dog = game.state.dog;
    return (
      <foreignObject x={0} y={height - 300} width={400} height={300}>
        <div className='bottom-left-status'>
          <div className='bottom-left-background'>
            {partnerCall && <div className='status-line'>
              Parner Call:
              <img
                className='card-image'
                src={getCardUrl(partnerCall)}
              />
            </div>}
            {dog.length > 0 && <div className='status-line'>
              <span className='title'>Dog:</span>
              {dog.map((card) => {
                return (
                  <img
                    key={`${card[0]}|${card[1]}`}
                    className='card-image'
                    src={getCardUrl(card)}
                  />
                );
              })}
            </div>}
          </div>
        </div>
      </foreignObject>
    )
  }
}