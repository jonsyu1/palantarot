import * as React from 'react';
import { Player } from '../../../server/model/Player';
import { Dispatchers } from '../../services/dispatchers';
import { InGameState } from '../../services/ingame/InGameTypes';
import './PlaySvgContainer.scss';
import { PlaySvgRoot } from './PlaySvgRoot';

interface Props {
  players: Map<string, Player>;
  game: InGameState;
  dispatchers: Dispatchers;
}

interface State {
  dimensions?: {
    width: number;
    height: number;
  }
}

export class PlaySvgContainer extends React.Component<Props, State> {
  private containerDiv: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {}
  }

  public render() {
    return (
      <div className='play-svg-container' ref={this.setContainerRef}>
        {this.renderCanvasElement()}
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('resize', this.windowResizeListener);
  }

  private renderCanvasElement = () => {
    const { players, game, dispatchers } = this.props;
    if (this.state.dimensions && this.containerDiv) {
      const { width, height } = this.state.dimensions;
      return (
        <PlaySvgRoot 
          width={width}
          height={height}
          players={players}
          game={game}
          dispatchers={dispatchers}
        />
      );
    }
  }

  private setContainerRef = (ref: HTMLDivElement) => {
    if (!this.containerDiv) {
      this.containerDiv = ref;
      this.setState({
        dimensions: {
          width: ref.clientWidth,
          height: ref.clientHeight,
        },
      });
    }
  }

  private windowResizeListener = () => {
    this.setState({
      dimensions: {
        width: this.containerDiv.clientWidth,
        height: this.containerDiv.clientHeight,
      },
    });
  }
}
