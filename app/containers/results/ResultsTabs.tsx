import * as React from 'react';
import { IMonth } from '../../../server/model/Month';
import { Result, RoleResult } from '../../../server/model/Result';
import { Tabs, Tab } from '@blueprintjs/core';
import { ResultsGraphContainer } from '../../components/results/ResultsGraphContainer';
import { ScoreTable } from '../../components/scoreTable/ScoreTable';
import { Player } from '../../../server/model/Player';
import { integerComparator } from '../../../server/utils/index';
import { loadContainer } from '../LoadingContainer';
import { playersLoader } from '../../services/players/index';
import { resultsLoader } from '../../services/results/index';

interface Props {
  players: Map<string, Player>;
  results: Result[];
  month: IMonth;
}
class ResultsTabsInternal extends React.PureComponent<Props> {
  public render() {
    if (this.props.results.length) {
      const tableTab = this.renderResultsTable((result) => result.all);
      const bidderTableTab = this.renderResultsTable((result) => result.bidder);
      const partnerTableTab = this.renderResultsTable((result) => result.partner);
      const oppositionTableTab = this.renderResultsTable((result) => result.opposition);
      const graphTab = (
        <ResultsGraphContainer
          monthGames={this.props.month}
          month={this.props.month}
        />
      );

      return (
        <div className='results-tabs-container'>
          <Tabs id='ResultsTabs' className='player-tabs' renderActiveTabPanelOnly={true}>
            <Tab id='ResultsTableTab' title='Score Chart' panel={tableTab} />
            <Tab id='BidderResultsTableTab' title='Best Bidder' panel={bidderTableTab} />
            <Tab id='PartnerResultsTableTab' title='Best Partner' panel={partnerTableTab} />
            <Tab id='OppositionResultsTableTab' title='Best Opponent' panel={oppositionTableTab} />
            <Tab id='ResultsGraphTab' title='Graph' panel={graphTab} />
          </Tabs>
        </div>
      );
    } else {
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 200}}>
          <h4 className='bp3-heading'> No results for this month!</h4>
        </div>
      );
    }
  }

  private renderResultsTable (accessor: (result: Result) => RoleResult | undefined) {
    const allRoleResults = this.props.results
      .map(accessor)
      .filter((result) => result)
      .sort(integerComparator((r: RoleResult) => r.points, 'desc')) as RoleResult[];
    return (
      <div className='results-table-container table-container'>
        <ScoreTable
          results={allRoleResults}
          players={this.props.players}
          renderDelta={true}
        />
      </div>
    );
  }
}

export const ResultsTabs = loadContainer({
  players: playersLoader,
  results: resultsLoader,
})(ResultsTabsInternal);